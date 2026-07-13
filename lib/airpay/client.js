import {
  airpayConfig,
  assertAirpayConfigured,
  AIRPAY_CHECKOUT_URL,
  AIRPAY_CURRENCY_CODE,
  AIRPAY_ISO_CURRENCY,
  AIRPAY_OAUTH_URL,
  AIRPAY_TIMEOUT_MS,
  AIRPAY_VERIFY_URL,
} from "./config";
import {
  buildChecksum,
  buildVerifyChecksum,
  decryptPayload,
  encryptPayload,
  privateKey,
  transportKey,
  verifySecureHash,
} from "./crypto";
import { mapAirpayStatus } from "./types";

/**
 * Airpay validates its text fields strictly and rejects the whole transaction
 * on a stray character, so every field is coerced into the documented charset
 * rather than passed through. Names allow only letters, digits and spaces;
 * remarks additionally allow "=".
 */
export function toAirpayName(value, max = 50) {
  return (value || "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "") // strip accents/dashes left by decomposition
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function toAirpayText(value, max = 100) {
  return (value || "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/[^A-Za-z0-9 =]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** Normalize a Tanzanian phone number to 255XXXXXXXXX. */
export function normalizePhone(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("255")) return digits;
  if (digits.startsWith("0")) return "255" + digits.slice(1);
  if (digits.length === 9) return "255" + digits;
  return digits;
}

/**
 * Airpay's orderid must be alphanumeric and at most 20 chars, so the hyphen in
 * our donation reference (ARF-XXXXXX) has to go. Stripping it is safe: the
 * hyphen sits at a fixed position, so distinct references stay distinct.
 */
export function buildAirpayOrderId(reference, attempt) {
  return `${reference.replace(/[^A-Za-z0-9]/g, "")}A${attempt}`.slice(0, 20);
}

/** Airpay wants the amount as a decimal string, e.g. "780000.00". */
function formatAmount(amount) {
  return (Math.round(amount * 100) / 100).toFixed(2);
}

/** fetch with an abort timeout and one retry-with-backoff on network/5xx errors. */
async function airpayFetch(url, init, attempts = 2) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), AIRPAY_TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      if (res.status >= 500 && i < attempts - 1) {
        lastErr = new Error(`Airpay ${res.status}`);
      } else {
        return res;
      }
    } catch (err) {
      lastErr = err;
    } finally {
      clearTimeout(timer);
    }
    await new Promise((r) => setTimeout(r, 500 * (i + 1)));
  }
  throw lastErr instanceof Error ? lastErr : new Error("Airpay request failed");
}

/**
 * Exchange our client credentials for the short-lived token that the checkout
 * URL must carry. The OAuth call is itself encrypted with the transport key.
 */
export async function getAccessToken() {
  assertAirpayConfigured();
  const key = transportKey();

  const request = {
    client_id: airpayConfig.clientId,
    client_secret: airpayConfig.clientSecret,
    grant_type: "client_credentials",
    merchant_id: airpayConfig.merchantId,
  };

  const body = new URLSearchParams({
    merchant_id: airpayConfig.merchantId,
    encdata: encryptPayload(request, key),
    checksum: buildChecksum(request),
  });

  const res = await airpayFetch(AIRPAY_OAUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Airpay OAuth returned ${res.status}: ${text.slice(0, 300)}`);
  }

  let envelope;
  try {
    envelope = JSON.parse(text);
  } catch {
    throw new Error(`Airpay OAuth returned non-JSON: ${text.slice(0, 300)}`);
  }

  const payload = envelope.response
    ? decryptPayload(envelope.response, key)
    : envelope;

  const token = payload?.data?.access_token ?? envelope.access_token;
  if (!token) {
    throw new Error("Airpay OAuth did not return an access token");
  }
  return token;
}

/**
 * Build the self-submitting checkout form for a payment attempt.
 *
 * This does NOT register the order with Airpay — the order only exists once the
 * donor's browser POSTs the form. A payment that is initiated but never posted
 * therefore never appears on Airpay's side at all, which is why reconciliation
 * treats "unknown order" as not-yet-paid rather than as an error.
 */
export async function buildCheckout(params) {
  assertAirpayConfigured();

  const name = toAirpayName(params.buyerName) || "ARIFA Supporter";
  const [firstName, ...rest] = name.split(" ");

  const data = {
    buyer_email: params.buyerEmail.slice(0, 50),
    buyer_phone: normalizePhone(params.buyerPhone),
    buyer_firstname: firstName.slice(0, 50),
    buyer_lastname: (rest.join(" ") || "Supporter").slice(0, 50),
    buyer_address: "Dar es Salaam",
    buyer_city: "Dar es Salaam",
    buyer_state: "Dar es Salaam",
    buyer_country: "Tanzania",
    buyer_pincode: "11101",
    amount: formatAmount(params.amount),
    orderid: params.orderId,
    currency_code: AIRPAY_CURRENCY_CODE,
    iso_currency: AIRPAY_ISO_CURRENCY,
    customvar: toAirpayText(params.remarks || "ARIFA donation"),
    merchant_id: airpayConfig.merchantId,
  };

  const token = await getAccessToken();

  return {
    paymentUrl: `${AIRPAY_CHECKOUT_URL}?token=${encodeURIComponent(token)}`,
    fields: {
      merchant_id: airpayConfig.merchantId,
      encdata: encryptPayload(data, transportKey()),
      checksum: buildChecksum(data),
      privatekey: privateKey(),
      chmod: params.chmod ?? "",
    },
  };
}

/**
 * Decrypt and hash-verify a transaction result POSTed back by Airpay.
 *
 * Throws if the blob cannot be decrypted with our transport key — an attacker
 * without our username+password cannot manufacture one. `hashValid` reports
 * whether ap_SecureHash also matched; callers must not settle money on a
 * result where it did not.
 */
export function parseCallback(responseBlob) {
  assertAirpayConfigured();

  const decoded = decryptPayload(responseBlob);
  const d = decoded?.data ?? {};

  const orderId = String(d.orderid ?? "");
  const transId = String(d.ap_transactionid ?? "");
  // Compare the amount exactly as Airpay sent it — the hash is over the string.
  const amountRaw = String(d.amount ?? "");
  const rawStatus = String(d.transaction_status ?? "");
  const message = String(d.message ?? "");

  const hashValid = verifySecureHash({
    transactionId: orderId,
    apTransactionId: transId,
    amount: amountRaw,
    status: rawStatus,
    message,
    secureHash: String(d.ap_securehash ?? ""),
    customerVpa: d.customer_vpa != null ? String(d.customer_vpa) : undefined,
    chmod: d.chmod != null ? String(d.chmod) : undefined,
  });

  return {
    orderId,
    transId,
    amount: Number(amountRaw),
    status: mapAirpayStatus(rawStatus),
    rawStatus,
    message,
    customVar: d.custom_var != null ? String(d.custom_var) : undefined,
    hashValid,
    raw: decoded,
  };
}

/** Pull the <TAG><![CDATA[value]]></TAG> pairs out of a verify response. */
function parseXml(text) {
  const out = {};
  const re = /<([A-Z_0-9]+)><!\[CDATA\[([\s\S]*?)\]\]><\/\1>/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

/**
 * Query Airpay for the authoritative status of an order.
 *
 * This is the server-to-server check that settlement prefers over anything the
 * browser hands us. It speaks the legacy verify endpoint, which answers in XML
 * and whose TRANSACTIONSTATUS conflates two very different things:
 *
 *   200 — the transaction succeeded
 *   503 — Airpay has no such order (never posted to checkout, or abandoned)
 *   400 — an API-level error (bad checksum, bad credentials), NOT a failed payment
 *
 * Treating 400/503 as a failed payment would wrongly kill live checkouts, so a
 * 503 is reported as "answered, not paid" (PENDING) and anything we cannot
 * interpret is reported as unanswered (`success: false`) — never as a failure.
 */
export async function verifyOrder(orderId) {
  assertAirpayConfigured();

  // AirpayId / terminalId / txnType are sent empty: the order id alone
  // identifies the attempt, and keeping them empty keeps the fixed-order
  // checksum unambiguous.
  const fields = {
    mercid: airpayConfig.merchantId,
    merchant_txnId: orderId,
    AirpayId: "",
    privatekey: privateKey(),
    terminalId: "",
    txnType: "",
  };

  const body = new URLSearchParams({
    ...fields,
    checksum: buildVerifyChecksum([
      fields.mercid,
      fields.merchant_txnId,
      fields.AirpayId,
      fields.terminalId,
      fields.txnType,
    ]),
  });

  try {
    const res = await airpayFetch(AIRPAY_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    const text = await res.text();
    const raw = parseXml(text);

    const code = raw.TRANSACTIONSTATUS ?? "";
    const message = raw.MESSAGE ?? "";
    const paymentStatus = raw.TRANSACTIONPAYMENTSTATUS ?? "";
    const transId = raw.APTRANSACTIONID || undefined;

    const unanswered = (msg) => ({
      success: false,
      orderId,
      status: "PENDING",
      message: msg,
      raw,
    });

    if (!res.ok || !code) {
      return unanswered(message || `Airpay verify returned ${res.status}`);
    }

    // Airpay knows nothing about this order: the donor never completed (or never
    // reached) the hosted checkout. Answered, and definitively not paid.
    if (code === "503" || /not available/i.test(paymentStatus || message)) {
      return {
        success: true,
        orderId,
        status: "PENDING",
        message: message || "No transaction at Airpay yet",
        raw,
      };
    }

    // API-level rejection (bad checksum/credentials). This says nothing about
    // the payment, so it must not settle anything.
    if (code === "400" && !transId) {
      console.error("[airpay] verify rejected", { orderId, message });
      return unanswered(message || "Airpay rejected the verify request");
    }

    return {
      success: true,
      orderId,
      status: mapAirpayStatus(code === "200" ? code : paymentStatus || code),
      transId,
      amount: raw.AMOUNT ? Number(raw.AMOUNT) : undefined,
      message: message || undefined,
      raw,
    };
  } catch (err) {
    console.error("[airpay] verify error", orderId, err);
    return {
      success: false,
      orderId,
      status: "PENDING",
      message: err instanceof Error ? err.message : "Network error",
    };
  }
}
