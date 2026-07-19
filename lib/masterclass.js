import { getBySlug } from "./content";

/**
 * Masterclass sessions are ContentItems, so their fee is admin-entered text.
 *
 * The USD figures on the card are marketing copy; this is the only number that
 * is ever charged. Airpay bills whole Tanzanian shillings, so a session without
 * a fee cannot be sold — it takes enquiries instead. That is deliberate: it
 * means an unpriced city can never charge a made-up amount.
 */
export function feeInShillings(session) {
  const digits = String(session?.fee_tzs ?? "").replace(/[^\d]/g, "");
  if (!digits) return null;
  const amount = Number(digits);
  return Number.isFinite(amount) && amount >= 1000 ? amount : null;
}

export function getSession(slug) {
  return getBySlug("MASTERCLASS", slug);
}

/** What the payer is buying, for the gateway remark and the admin list. */
export function sessionLabel(session) {
  return `Masterclass ${session.title}${session.date ? ` (${session.date})` : ""}`.slice(
    0,
    80,
  );
}
