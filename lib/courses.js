import { getBySlug } from "./content";

/**
 * Short courses are ContentItems, so their price is admin-entered text.
 *
 * The "200,000 Tsh" on the card is display copy; `price_tzs` is the only number
 * ever charged. Airpay bills whole Tanzanian shillings, so a course without a
 * fee cannot be sold online — Enroll takes an enquiry instead. That is
 * deliberate: an unpriced course can never charge a made-up amount.
 */
export function feeInShillings(course) {
  const digits = String(course?.price_tzs ?? "").replace(/[^\d]/g, "");
  if (!digits) return null;
  const amount = Number(digits);
  return Number.isFinite(amount) && amount >= 1000 ? amount : null;
}

export function getCourse(slug) {
  return getBySlug("COURSE", slug);
}

/** What the payer is buying, for the gateway remark and the admin list. */
export function courseLabel(course) {
  return `Short Course: ${course.title}`.slice(0, 80);
}
