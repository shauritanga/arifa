/** Normalize the configured base URL: drop a trailing slash and a trailing
 * `/v1` segment, because request paths already include `/v1/...`. */
function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, "").replace(/\/v1$/i, "");
}

/** Selcom gateway configuration, read from environment. */
export const selcomConfig = {
  baseUrl: normalizeBaseUrl(
    process.env.SELCOM_BASE_URL || "https://apigw.selcommobile.com",
  ),
  apiKey: process.env.SELCOM_API_KEY || "",
  apiSecret: process.env.SELCOM_API_SECRET || "",
  vendorId: process.env.SELCOM_VENDOR_ID || "",
  currency: process.env.SELCOM_CURRENCY || "TZS",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
};

/** How long to wait on any single Selcom HTTP call before aborting. */
export const SELCOM_TIMEOUT_MS = Number(process.env.SELCOM_TIMEOUT_MS || "15000");

/**
 * Fail fast (with a clear message) when the gateway is not fully configured.
 * Called at the top of every outbound Selcom call so a misconfigured deploy
 * surfaces an explicit error instead of silently mis-charging or hanging.
 */
export function assertSelcomConfigured() {
  const missing = [];
  if (!selcomConfig.apiKey) missing.push("SELCOM_API_KEY");
  if (!selcomConfig.apiSecret) missing.push("SELCOM_API_SECRET");
  if (!selcomConfig.vendorId) missing.push("SELCOM_VENDOR_ID");
  if (!selcomConfig.siteUrl) missing.push("NEXT_PUBLIC_SITE_URL");
  if (missing.length) {
    throw new Error(`Selcom is not configured — missing env: ${missing.join(", ")}`);
  }
}
