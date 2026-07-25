import { selcomConfig } from "../../../../lib/selcom/config";
import {
  findDonationByGatewayOrderId,
  verifyDonation,
  applyDonationStatus,
} from "../../../../lib/donations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Browser redirect target after the donor completes (or abandons) the Selcom
 * hosted checkout. The `order` param is the per-attempt Selcom order_id. We
 * verify status server-side, then redirect to the friendly payment status page
 * keyed by the stable donation reference.
 */
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const orderId = params.get("order") || params.get("order_id") || "";

  if (!orderId) return redirectHome();

  const donation = await findDonationByGatewayOrderId(orderId).catch(() => null);
  if (!donation) {
    console.warn("[selcom] callback for unknown order_id", { orderId });
    return redirectHome();
  }

  // Authoritative re-check against Selcom (settles PAID/FAILED/CANCELLED safely).
  const result = await verifyDonation(donation.reference, "REDIRECT").catch(() => null);

  // Explicit cancel: if the gateway confirms it isn't paid, mark CANCELLED so
  // the donor immediately sees a clear "cancelled — retry" screen instead of a
  // lingering "processing". verifyDonation already guards against touching a
  // PAID row, and PAID is never reached here since result.status wasn't PAID.
  const cancelled = params.get("cancel") === "1";
  if (cancelled && result && result.status !== "PAID") {
    await applyDonationStatus(donation.reference, "CANCELLED", {
      reason: "Cancelled by donor on the Selcom checkout",
      source: "REDIRECT",
    }).catch(() => null);
  }

  return Response.redirect(statusUrl(donation), 303);
}

/**
 * Selcom lands every payer at this one callback route, so the landing page is
 * chosen here: a Masterclass registrant is following a training journey and
 * should not be dropped on the donation status page.
 */
function statusUrl(donation) {
  const path =
    donation.type === "TRAINING"
      ? `/training/masterclass/payment/${encodeURIComponent(donation.reference)}`
      : `/support-us/payment/${encodeURIComponent(donation.reference)}`;
  return new URL(path, selcomConfig.siteUrl).toString();
}

function redirectHome() {
  return Response.redirect(new URL("/support-us", selcomConfig.siteUrl).toString(), 303);
}
