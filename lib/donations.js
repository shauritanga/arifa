import crypto from "crypto";
import { prisma } from "./prisma";
import { buildAirpayOrderId, buildCheckout, verifyOrder } from "./airpay/client";
import { CHMOD_BY_METHOD } from "./airpay/types";

/**
 * Donation lifecycle on top of the Airpay gateway.
 *
 * Where a status transition came from, for the audit log:
 *   REDIRECT | CALLBACK | RECONCILE | POLL | INITIATE | SYSTEM
 */

const METHOD_BY_INPUT = {
  card: "CARD",
  mobile_money: "MOBILE_MONEY",
};

/** Human-facing donation reference, e.g. ARF-7F3K9Q. Ambiguous chars omitted. */
function generateReference() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(6);
  let out = "";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `ARF-${out}`;
}

/**
 * Create a donation and build its Airpay checkout.
 *
 * Airpay has no server-to-server "create order" call, so this returns a form for
 * the browser to POST rather than a URL to redirect to. The order does not exist
 * on Airpay until that POST happens.
 */
export async function initiateDonation(input) {
  const donation = await prisma.donation.create({
    data: {
      reference: generateReference(),
      type: input.type === "sponsorship" ? "SPONSORSHIP" : "DONATION",
      status: "PENDING",
      method: input.method ? METHOD_BY_INPUT[input.method] : "UNSET",
      donorName: input.name,
      email: input.email,
      phone: input.phone,
      organization: input.organization || null,
      packageName: input.packageName || null,
      message: input.message || null,
      amount: input.amount,
    },
  });

  return startCheckout(donation);
}

/**
 * Re-open an unpaid donation for another attempt (the donor's "try again").
 * A settled donation is never re-charged.
 */
export async function retryDonation(reference) {
  const donation = await prisma.donation.findUnique({ where: { reference } });
  if (!donation) return { ok: false, error: "Donation not found" };
  if (donation.status === "PAID") {
    return { ok: false, error: "This donation has already been paid" };
  }
  return startCheckout(donation);
}

/**
 * Snapshot this attempt's orderid on the donation BEFORE handing the form to the
 * browser, so the callback can resolve it and check the amount. Each attempt gets
 * a fresh, unique gateway orderid so a retry never collides with the earlier one
 * on Airpay's side.
 */
async function startCheckout(donation) {
  const attempt = donation.attempt + 1;
  const gatewayOrderId = buildAirpayOrderId(donation.reference, attempt);

  await prisma.donation.update({
    where: { id: donation.id },
    data: {
      status: "PROCESSING",
      attempt,
      gatewayOrderId,
      failureReason: null,
    },
  });

  try {
    const checkout = await buildCheckout({
      orderId: gatewayOrderId,
      amount: donation.amount,
      buyerName: donation.donorName,
      buyerEmail: donation.email,
      buyerPhone: donation.phone,
      chmod: CHMOD_BY_METHOD[donation.method],
      remarks:
        donation.type === "SPONSORSHIP"
          ? `ARIFA sponsorship ${donation.packageName ?? ""}`
          : "ARIFA donation",
    });

    return {
      ok: true,
      paymentUrl: checkout.paymentUrl,
      fields: checkout.fields,
      reference: donation.reference,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start payment";
    console.error("[airpay] checkout build failed", gatewayOrderId, err);
    await prisma.donation.update({
      where: { id: donation.id },
      data: { status: "FAILED", failureReason: message },
    });
    return { ok: false, error: "Payment could not be started" };
  }
}

/** Resolve a donation from the per-attempt Airpay orderid. */
export async function findDonationByGatewayOrderId(orderId) {
  return prisma.donation.findUnique({ where: { gatewayOrderId: orderId } });
}

/**
 * Apply a resolved gateway status to a donation.
 * The settle is guarded so a settled (PAID) donation is never downgraded by a
 * racing callback/poll, and is idempotent when it fires twice.
 */
export async function applyDonationStatus(reference, status, opts = {}) {
  // Guarded conditional update: only transition rows that aren't already PAID
  // (a refund is the one allowed post-PAID transition).
  const guard =
    status === "REFUNDED" ? { reference } : { reference, status: { not: "PAID" } };

  const data = {
    status,
    ...(opts.transId ? { gatewayTransId: opts.transId } : {}),
    ...(opts.reason ? { failureReason: opts.reason } : {}),
    ...(status === "PAID" ? { paidAt: new Date() } : {}),
    ...(opts.payload != null ? { gatewayPayload: opts.payload } : {}),
  };

  // Capture the prior status so the audit log records the actual transition.
  const prior = await prisma.donation.findUnique({
    where: { reference },
    select: { id: true, status: true },
  });
  if (!prior) return { ok: false, error: "Donation not found" };

  const { count } = await prisma.donation.updateMany({ where: guard, data });

  // No row changed → it was already settled (idempotent no-op).
  if (count === 0) {
    return { ok: true, alreadySettled: true };
  }

  // Append-only audit of the transition we just made. Never let an audit-write
  // failure break settlement.
  await prisma.donationEvent
    .create({
      data: {
        donationId: prior.id,
        fromStatus: prior.status,
        toStatus: status,
        source: opts.source ?? "SYSTEM",
        amount: opts.amount != null ? Math.round(opts.amount) : null,
        message: opts.reason ?? null,
      },
    })
    .catch((err) => console.error("[donations] audit write failed", reference, err));

  return { ok: true };
}

/**
 * Establish the authoritative status of a donation and reconcile it locally.
 * This is the ONLY path that can mark a donation PAID.
 *
 * Two sources of truth, in order of preference:
 *
 *  1. Airpay's server-to-server verify endpoint. Nothing the donor's browser
 *     touches is involved, so this is preferred whenever it answers.
 *
 *  2. A `trusted` callback result — only when verify is unreachable. This is not
 *     a raw request body: `parseCallback` has already decrypted it with our
 *     transport key (which an attacker cannot know) and checked ap_SecureHash.
 *     Callers MUST NOT pass a result whose hashValid is false; we re-check here
 *     anyway, and the amount is still verified against our own row below.
 *
 * Either way, PAID is never applied unless the gateway-reported amount matches
 * the amount we recorded at initiation.
 */
export async function verifyDonation(reference, source = "POLL", trusted) {
  const donation = await prisma.donation.findUnique({ where: { reference } });
  if (!donation || !donation.gatewayOrderId) {
    return { ok: false, status: donation?.status ?? "PENDING" };
  }

  const verified = await verifyOrder(donation.gatewayOrderId);

  // Fall back to the callback only when the verify endpoint gave us nothing, and
  // only if it is for this exact attempt and its hash checked out.
  const usable =
    trusted &&
    trusted.hashValid &&
    trusted.orderId === donation.gatewayOrderId &&
    !verified.success
      ? trusted
      : null;

  const resolved = verified.success
    ? {
        status: verified.status,
        amount: verified.amount,
        transId: verified.transId,
        raw: verified.raw,
      }
    : usable
      ? {
          status: usable.status,
          amount: usable.amount,
          transId: usable.transId,
          raw: usable.raw,
        }
      : null;

  if (!resolved) {
    // Neither source could tell us anything — leave the donation untouched. The
    // reconciler will keep retrying; nothing is lost.
    console.warn("[airpay] status unresolved", {
      reference,
      orderId: donation.gatewayOrderId,
      message: verified.message,
    });
    return { ok: false, status: donation.status, unresolved: true };
  }

  if (resolved.status === "PAID") {
    const amountOk =
      resolved.amount != null &&
      Number.isFinite(resolved.amount) &&
      Math.round(resolved.amount) === donation.amount;

    if (!amountOk) {
      // Settling would record a payment we didn't ask for — refuse and flag.
      console.error("[airpay] amount mismatch on PAID", {
        reference,
        expected: donation.amount,
        got: resolved.amount,
      });
      await applyDonationStatus(reference, "PROCESSING", {
        reason: `Amount mismatch: expected ${donation.amount} TZS, gateway reported ${resolved.amount}`,
        payload: resolved.raw,
        source,
        amount: resolved.amount,
      });
      return { ok: false, status: "PROCESSING", mismatch: true };
    }

    await applyDonationStatus(reference, "PAID", {
      transId: resolved.transId,
      payload: resolved.raw,
      source,
      amount: resolved.amount,
    });
  } else if (resolved.status === "FAILED" || resolved.status === "CANCELLED") {
    await applyDonationStatus(reference, resolved.status, {
      transId: resolved.transId,
      payload: resolved.raw,
      source,
      amount: resolved.amount,
    });
  }

  return { ok: true, status: resolved.status };
}
