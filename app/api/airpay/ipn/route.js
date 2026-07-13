import { readAirpayBody, resolveInbound } from "../../../../lib/airpay/inbound";
import { findDonationByGatewayOrderId, verifyDonation } from "../../../../lib/donations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Airpay's IPN (server-to-server webhook).
 *
 * This is the leg that survives the donor closing their tab mid-payment, which
 * the browser response URL does not — so it is what makes settlement reliable
 * rather than best-effort.
 *
 * It shares its body format and its (dis)trust rules with the response URL, but
 * answers with a plain 200 instead of a redirect: Airpay is a server here, not a
 * browser, and a 3xx would look like a failed delivery. We always ack, even for
 * bodies we reject — a retry loop would not fix a forged or unknown order, and
 * the reconciler is the real safety net.
 */
export async function POST(request) {
  let body;
  try {
    body = await readAirpayBody(request);
  } catch {
    return Response.json({ status: "ignored" });
  }

  const { orderId, trusted } = resolveInbound(body);
  if (!orderId) {
    return Response.json({ status: "ignored" });
  }

  const donation = await findDonationByGatewayOrderId(orderId).catch(() => null);
  if (!donation) {
    console.warn("[airpay] IPN for unknown orderid", { orderId });
    return Response.json({ status: "ignored" });
  }

  await verifyDonation(donation.reference, "CALLBACK", trusted).catch((err) =>
    console.error("[airpay] IPN verifyDonation failed", donation.reference, err),
  );

  return Response.json({ status: "ok" });
}
