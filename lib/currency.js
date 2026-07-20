/**
 * Prices are quoted to visitors in USD, but Airpay settles in Tanzanian
 * shillings (see lib/airpay/config.js — the gateway is hardcoded to TZS).
 *
 * Nothing in this module touches what is charged. The shilling figure stays the
 * only number ever sent to the gateway; USD is presentation on top of it. Every
 * screen that shows a USD headline must also show the shilling amount, so the
 * payer is never surprised by the currency their bank actually debits.
 */

/**
 * Masterclass sessions carry an admin-entered USD price (early_price /
 * standard_price). Short courses only store shillings, so their USD headline is
 * derived from this rate. Update it as the real rate drifts — it moves the
 * displayed figure only, never the amount billed.
 */
export const TZS_PER_USD = 2700;

/** Parse an admin-entered USD string ("$750.00", "USD 750") into a number. */
export function parseUsd(value) {
  const cleaned = String(value ?? "").replace(/[^\d.]/g, "");
  if (!cleaned) return null;
  const amount = Number(cleaned);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

/**
 * Shillings -> USD headline, rounded to the nearest $5 so converted course
 * prices read as prices ("USD 75") rather than as conversions ("USD 74.07").
 */
export function usdFromShillings(shillings) {
  if (!Number.isFinite(shillings) || shillings <= 0) return null;
  return Math.max(5, Math.round(shillings / TZS_PER_USD / 5) * 5);
}

/** "USD 750" — whole dollars; the site quotes no cents. */
export function formatUsd(amount) {
  if (!Number.isFinite(amount)) return "";
  return `USD ${Math.round(amount).toLocaleString("en-US")}`;
}

/** "TSh 1,950,000" — what Airpay actually bills. */
export function formatShillings(shillings) {
  if (!Number.isFinite(shillings)) return "";
  return `TSh ${shillings.toLocaleString("en-TZ")}`;
}

/**
 * The USD headline for a priced item: an explicit admin USD price when there is
 * one, otherwise converted from the shilling fee. Returns null when neither
 * exists, which callers treat as "not purchasable online".
 */
export function usdHeadline({ usdPrice, shillings } = {}) {
  return parseUsd(usdPrice) ?? usdFromShillings(shillings);
}
