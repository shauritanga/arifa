import { reconcileDonations } from "../../../../lib/donations-reconcile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Scheduled reconciliation sweep. Call every few minutes from cron:
 *
 *   curl -sS -H "Authorization: Bearer $CRON_SECRET" \
 *     https://arifa.org/api/cron/reconcile-donations
 *
 * Guarded by a shared secret because it drives real settlement.
 */
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[cron] CRON_SECRET is not set — refusing to run");
    return Response.json({ error: "Not configured" }, { status: 500 });
  }

  const auth = request.headers.get("authorization") || "";
  if (auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await reconcileDonations();
    return Response.json({ ok: true, ...stats });
  } catch (err) {
    console.error("[cron] reconcile failed", err);
    return Response.json({ error: "Reconcile failed" }, { status: 500 });
  }
}
