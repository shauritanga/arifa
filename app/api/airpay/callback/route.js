import { airpayConfig } from "../../../../lib/airpay/config";
import { readAirpayBody, resolveInbound } from "../../../../lib/airpay/inbound";
import { findDonationByGatewayOrderId, verifyDonation } from "../../../../lib/donations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Airpay's response URL (success/failure) — the browser-facing return leg.
 *
 * Airpay accepts no per-transaction return URL: this address is registered once
 * on the merchant account. Airpay delivers the result by POSTing the donor's
 * browser here, so we settle and then hand the donor to their status page.
 *
 * The body is never trusted on its face — see resolveInbound and verifyDonation.
 */
export async function POST(request) {
  let body;
  try {
    body = await readAirpayBody(request);
  } catch {
    return redirectHome();
  }

  const { orderId, trusted } = resolveInbound(body);
  if (!orderId) return redirectHome();

  const donation = await findDonationByGatewayOrderId(orderId).catch(() => null);
  if (!donation) {
    console.warn("[airpay] callback for unknown orderid", { orderId });
    return redirectHome();
  }

  await verifyDonation(donation.reference, "CALLBACK", trusted).catch((err) =>
    console.error("[airpay] callback verifyDonation failed", donation.reference, err),
  );

  // Airpay POSTs the browser here, so redirect with 303 to turn it into a GET.
  return Response.redirect(statusUrl(donation), 303);
}

/**
 * Some Airpay configurations issue a plain GET to the response URL (e.g. when
 * the donor backs out of the checkout). Resolve what we can and send them to
 * their status page; settlement still happens through verifyDonation.
 */
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const orderId =
    params.get("TRANSACTIONID") || params.get("orderid") || params.get("order") || "";

  if (!orderId) return redirectHome();

  const donation = await findDonationByGatewayOrderId(orderId).catch(() => null);
  if (!donation) return redirectHome();

  await verifyDonation(donation.reference, "REDIRECT").catch(() => null);

  return Response.redirect(statusUrl(donation), 303);
}

/**
 * Airpay returns every payer to this one registered URL, so the landing page is
 * chosen here: a Masterclass registrant is following a training journey and
 * should not be dropped on the donation status page.
 */
function statusUrl(donation) {
  const path =
    donation.type === "TRAINING"
      ? `/training/masterclass/payment/${encodeURIComponent(donation.reference)}`
      : `/support-us/payment/${encodeURIComponent(donation.reference)}`;
  return new URL(path, airpayConfig.siteUrl).toString();
}

function redirectHome() {
  return Response.redirect(new URL("/support-us", airpayConfig.siteUrl).toString(), 303);
}
