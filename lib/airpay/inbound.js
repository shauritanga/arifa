import { parseCallback } from "./client";

/**
 * Shared handling for the two ways Airpay reports a result back to us: the
 * browser POST to the response URL, and the server-to-server IPN. Both carry the
 * same body, so both are read here and settle through the same path.
 *
 * The `trusted` result is present only when the body decrypted with our
 * transport key AND its ap_SecureHash matched — i.e. it provably came from
 * Airpay. Anything else is a bare trigger with no authority to settle money.
 */

/** Read an Airpay request body (JSON or form-encoded). */
export async function readAirpayBody(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await req.json();
  }
  const body = {};
  const form = await req.formData();
  form.forEach((v, k) => (body[k] = String(v)));
  return body;
}

/**
 * Resolve which order a result refers to, and whether we may trust its contents.
 * Never throws: an undecryptable body yields no order id rather than a 500, so a
 * malformed or forged POST is simply ignored.
 */
export function resolveInbound(body) {
  if (body.response) {
    try {
      const result = parseCallback(body.response);
      if (!result.hashValid) {
        // Decrypted with our key but the hash didn't match — should never happen
        // in normal operation. Usable to identify the order, never to settle it.
        console.error("[airpay] ap_SecureHash mismatch", {
          orderId: result.orderId,
          status: result.rawStatus,
        });
        return { orderId: result.orderId };
      }
      return { orderId: result.orderId, trusted: result };
    } catch (err) {
      console.error("[airpay] inbound body could not be decrypted", err);
      return { orderId: "" };
    }
  }

  // Plaintext result (older Airpay kits). It carries no proof of origin, so it
  // only tells us which order to go re-verify with Airpay directly.
  return { orderId: body.TRANSACTIONID || body.orderid || "" };
}
