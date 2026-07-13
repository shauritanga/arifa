/** Airpay Tanzania gateway configuration, read from environment. */
export const airpayConfig = {
  merchantId: process.env.AIRPAY_MERCHANT_ID || "",
  username: process.env.AIRPAY_USERNAME || "",
  password: process.env.AIRPAY_PASSWORD || "",
  /** Airpay calls this the "API key"; it is the salt for `privatekey`. */
  apiKey: process.env.AIRPAY_API_KEY || "",
  clientId: process.env.AIRPAY_CLIENT_ID || "",
  clientSecret: process.env.AIRPAY_CLIENT_SECRET || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
};

/** Airpay endpoints. Airpay Tanzania has no separate sandbox host. */
export const AIRPAY_OAUTH_URL =
  process.env.AIRPAY_OAUTH_URL ||
  "https://kraken.airpay.tz/airpay/pay/v1/api/oauth2";
export const AIRPAY_CHECKOUT_URL =
  process.env.AIRPAY_CHECKOUT_URL ||
  "https://payments.airpay.tz/pay/v1/index.php";
export const AIRPAY_VERIFY_URL =
  process.env.AIRPAY_VERIFY_URL || "https://payments.airpay.tz/order/verify.php";

/** Numeric ISO-4217 code for the Tanzanian shilling, which Airpay charges in. */
export const AIRPAY_CURRENCY_CODE = "834";
export const AIRPAY_ISO_CURRENCY = "TZS";

/** How long to wait on any single Airpay HTTP call before aborting. */
export const AIRPAY_TIMEOUT_MS = Number(process.env.AIRPAY_TIMEOUT_MS || "15000");

/**
 * Fail fast (with a clear message) when the gateway is not fully configured.
 * Called at the top of every outbound Airpay call so a misconfigured deploy
 * surfaces an explicit error instead of silently mis-charging or hanging.
 */
export function assertAirpayConfigured() {
  const missing = [];
  if (!airpayConfig.merchantId) missing.push("AIRPAY_MERCHANT_ID");
  if (!airpayConfig.username) missing.push("AIRPAY_USERNAME");
  if (!airpayConfig.password) missing.push("AIRPAY_PASSWORD");
  if (!airpayConfig.apiKey) missing.push("AIRPAY_API_KEY");
  if (!airpayConfig.clientId) missing.push("AIRPAY_CLIENT_ID");
  if (!airpayConfig.clientSecret) missing.push("AIRPAY_CLIENT_SECRET");
  if (!airpayConfig.siteUrl) missing.push("NEXT_PUBLIC_SITE_URL");
  if (missing.length) {
    throw new Error(`Airpay is not configured — missing env: ${missing.join(", ")}`);
  }
}
