import { prisma } from "./prisma";
import { verifyDonation, applyDonationStatus } from "./donations";

/**
 * Background donation reconciliation — the real-money safety net.
 *
 * The Airpay callback is best-effort: it is delivered through the donor's
 * browser, so closing the tab loses it. This sweep makes correctness independent
 * of that — it periodically re-asks Airpay for the authoritative status of every
 * unresolved donation and settles it (via verifyDonation, which is the only path
 * allowed to mark PAID and which verifies the amount first). It also expires
 * genuinely-abandoned checkouts.
 *
 * Safe by construction:
 *  - Never marks PAID without the gateway + amount check (verifyDonation).
 *  - Only expires to CANCELLED AFTER a fresh gateway answer shows not-paid; a
 *    donation whose status we could not establish is left alone entirely.
 *  - CANCELLED → PAID is still allowed downstream, so a late settle is never
 *    lost; we also keep re-checking recently-cancelled rows for a grace window.
 *  - Idempotent and rate-limited per row.
 */

/** Don't re-hit Airpay for a row checked within this window (ms). */
const POLL_INTERVAL_MS = 90_000;
/** Keep re-checking cancelled rows this long, in case a late payment lands. */
const CANCELLED_GRACE_MS = 24 * 60 * 60 * 1000;
/** Mark an unpaid checkout abandoned (CANCELLED) after this many minutes. */
const ABANDON_MINUTES = Number(process.env.PAYMENT_ABANDON_MINUTES || "60");

export async function reconcileDonations() {
  const now = Date.now();
  const staleBefore = new Date(now - POLL_INTERVAL_MS);
  const cancelledSince = new Date(now - CANCELLED_GRACE_MS);

  // Non-terminal rows that haven't been checked recently, plus recently
  // cancelled rows (to catch a late payment). Bounded batch.
  const candidates = await prisma.donation.findMany({
    where: {
      gatewayOrderId: { not: null },
      updatedAt: { lt: staleBefore },
      OR: [
        { status: { in: ["PENDING", "PROCESSING"] } },
        { status: "CANCELLED", updatedAt: { gt: cancelledSince } },
      ],
    },
    orderBy: { updatedAt: "asc" },
    take: 100,
    select: { reference: true, status: true, createdAt: true },
  });

  const stats = {
    checked: 0,
    paid: 0,
    failed: 0,
    cancelled: 0,
    mismatches: 0,
    expired: 0,
    unresolved: 0,
  };

  for (const c of candidates) {
    stats.checked++;
    // Authoritative re-check against Airpay (safely settles PAID/FAILED/CANCELLED).
    const res = await verifyDonation(c.reference, "RECONCILE").catch((err) => {
      console.error("[reconcile] verifyDonation failed", c.reference, err);
      return null;
    });
    if (!res) continue;

    // The gateway told us nothing (unreachable / unreadable answer). We have no
    // evidence the donor didn't pay, so we must not expire this row — leave it
    // for the next sweep.
    if (res.unresolved) {
      stats.unresolved++;
      continue;
    }

    if (res.status === "PAID") stats.paid++;
    else if (res.status === "FAILED") stats.failed++;
    else if (res.status === "CANCELLED") stats.cancelled++;

    if (res.mismatch) {
      stats.mismatches++;
      continue; // left PROCESSING for manual review; do not expire
    }

    // Abandon expiry: gateway just confirmed not-paid AND it's older than TTL.
    const stillOpen = res.status === "PENDING" || res.status === "PROCESSING";
    const ageMs = now - new Date(c.createdAt).getTime();
    if (stillOpen && ageMs > ABANDON_MINUTES * 60_000) {
      await applyDonationStatus(c.reference, "CANCELLED", {
        reason: `Abandoned — gateway not paid after ${ABANDON_MINUTES}m`,
        source: "RECONCILE",
      }).catch((err) =>
        console.error("[reconcile] expire failed", c.reference, err),
      );
      stats.expired++;
    }
  }

  return stats;
}
