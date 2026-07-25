import { findDonationByGatewayOrderId, verifyDonation } from "../../../../lib/donations";
import { verifyWebhookSignature } from "../../../../lib/selcom/sign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-to-server payment notification from Selcom.
 *
 * The webhook body is treated as an UNTRUSTED trigger only: we resolve the
 * donation from the order_id and then settle strictly from the authoritative
 * order-status endpoint (see verifyDonation). A forged POST therefore cannot
 * move money — the worst it can do is trigger an extra status query.
 */
export async function POST(request) {
  let payload = {};
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const form = await request.formData();
      form.forEach((v, k) => (payload[k] = String(v)));
    }
  } catch {
    return Response.json({ result: "FAIL", message: "Invalid body" }, { status: 400 });
  }

  const orderId =
    payload.order_id || payload.orderid || payload.reference || payload.order;
  if (!orderId) {
    return Response.json({ result: "FAIL", message: "Missing order id" }, { status: 400 });
  }

  // Advisory signature check — logged, never used to settle.
  const digest = request.headers.get("digest") || payload.digest;
  const signedFields = (request.headers.get("signed-fields") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const sigCheck = verifyWebhookSignature(
    payload,
    digest ?? undefined,
    signedFields.length ? signedFields : undefined,
    request.headers.get("timestamp") ?? undefined,
  );
  if (sigCheck === "invalid") {
    console.warn("[selcom] webhook signature invalid", { orderId });
  }

  const donation = await findDonationByGatewayOrderId(orderId).catch(() => null);
  if (!donation) {
    // Ack so Selcom doesn't retry forever, but record the miss.
    console.warn("[selcom] webhook for unknown order_id", { orderId });
    return Response.json({ result: "SUCCESS" });
  }

  // Settle from the authoritative order-status endpoint only.
  await verifyDonation(donation.reference, "WEBHOOK").catch((err) =>
    console.error("[selcom] webhook verifyDonation failed", donation.reference, err),
  );

  return Response.json({ result: "SUCCESS" });
}
