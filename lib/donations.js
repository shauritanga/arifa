import crypto from "crypto";
import { prisma } from "./prisma";
import { createOrder, getOrderStatus } from "./selcom/client";
import { SELCOM_METHOD_BY_TYPE } from "./selcom/types";

/**
 * Donation lifecycle on top of the Selcom gateway.
 *
 * Where a status transition came from, for the audit log:
 *   REDIRECT | WEBHOOK | RECONCILE | POLL | INITIATE | MANUAL | SYSTEM
 */

const METHOD_BY_INPUT = {
  card: "CARD",
  mobile_money: "MOBILE_MONEY",
};

const TYPE_BY_INPUT = {
  sponsorship: "SPONSORSHIP",
  training: "TRAINING",
};

/** Human-facing donation reference, e.g. ARF-7F3K9Q. Ambiguous chars omitted. */
function generateReference() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(6);
  let out = "";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `ARF-${out}`;
}

/** Create a donation and start its Selcom checkout. */
export async function initiateDonation(input) {
  const donation = await prisma.donation.create({
    data: {
      reference: generateReference(),
      type: TYPE_BY_INPUT[input.type] ?? "DONATION",
      status: "PENDING",
      method: input.method ? METHOD_BY_INPUT[input.method] : "UNSET",
      donorName: input.name,
      email: input.email,
      phone: input.phone,
      organization: input.organization || null,
      packageName: input.packageName || null,
      position: input.position || null,
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
 * Snapshot this attempt's order_id on the donation BEFORE calling Selcom, so
 * the callback/webhook can resolve it and check the amount. Each attempt gets
 * a fresh, unique gateway order_id so a retry never collides with the earlier
 * one on Selcom's side.
 */
async function startCheckout(donation) {
  const attempt = donation.attempt + 1;
  const gatewayOrderId = `${donation.reference}-A${attempt}`;

  await prisma.donation.update({
    where: { id: donation.id },
    data: {
      status: "PROCESSING",
      attempt,
      gatewayOrderId,
      failureReason: null,
    },
  });

  const order = await createOrder({
    orderId: gatewayOrderId,
    amount: donation.amount,
    currency: donation.currency,
    buyerName: donation.donorName,
    buyerEmail: donation.email,
    buyerPhone: donation.phone,
    paymentMethods: SELCOM_METHOD_BY_TYPE[donation.method] ?? "ALL",
    remarks: remarksFor(donation),
  });

  if (!order.success || !order.checkoutUrl) {
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: "FAILED",
        failureReason: order.message ?? "Failed to initiate payment",
        gatewayPayload: order.raw ?? undefined,
      },
    });
    return { ok: false, error: order.message ?? "Payment initiation failed" };
  }

  await prisma.donation.update({
    where: { id: donation.id },
    data: { gatewayPayload: order.raw ?? undefined },
  });

  return {
    ok: true,
    checkoutUrl: order.checkoutUrl,
    reference: donation.reference,
  };
}

/** What the payer sees on their statement / gateway receipt. */
function remarksFor(donation) {
  if (donation.type === "SPONSORSHIP") {
    return `ARIFA sponsorship ${donation.packageName ?? ""}`;
  }
  if (donation.type === "TRAINING") {
    return `ARIFA Masterclass ${donation.packageName ?? ""}`;
  }
  return "ARIFA donation";
}

/** Resolve a donation from the per-attempt Selcom order_id. */
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
 * Query Selcom for the authoritative status of a donation and reconcile it
 * locally. This is the ONLY path that can mark a donation PAID — webhook/
 * callback bodies are never trusted directly, only used as a trigger to call
 * this. Before settling PAID we verify the gateway-reported amount against
 * the amount recorded at initiation.
 */
export async function verifyDonation(reference, source = "POLL") {
  const donation = await prisma.donation.findUnique({ where: { reference } });
  if (!donation || !donation.gatewayOrderId) {
    return { ok: false, status: donation?.status ?? "PENDING" };
  }

  const result = await getOrderStatus(donation.gatewayOrderId);

  if (!result.success) {
    // Gateway unreachable or answered nothing usable — leave the donation
    // untouched. The reconciler will keep retrying; nothing is lost.
    return { ok: false, status: donation.status, unresolved: true };
  }

  if (result.status === "PAID") {
    const amountOk =
      result.amount != null &&
      Number.isFinite(result.amount) &&
      Math.round(result.amount) === donation.amount;

    if (!amountOk) {
      // Settling would record a payment we didn't ask for — refuse and flag.
      console.error("[selcom] amount mismatch on PAID", {
        reference,
        expected: donation.amount,
        got: result.amount,
      });
      await applyDonationStatus(reference, "PROCESSING", {
        reason: `Amount mismatch: expected ${donation.amount} TZS, gateway reported ${result.amount}`,
        payload: result.raw,
        source,
        amount: result.amount,
      });
      return { ok: false, status: "PROCESSING", mismatch: true };
    }

    await applyDonationStatus(reference, "PAID", {
      transId: result.transId,
      payload: result.raw,
      source,
      amount: result.amount,
    });
  } else if (result.status === "FAILED" || result.status === "CANCELLED") {
    await applyDonationStatus(reference, result.status, {
      transId: result.transId,
      payload: result.raw,
      source,
      amount: result.amount,
    });
  }

  return { ok: true, status: result.status };
}
