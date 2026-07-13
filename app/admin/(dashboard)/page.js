import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import StatusPill from "./status-pill";

export const dynamic = "force-dynamic";

const TZS = new Intl.NumberFormat("en-TZ");

export default async function OverviewPage() {
  const [paid, byStatus, recent, newApplications, newMessages] = await Promise.all([
    prisma.donation.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.donation.groupBy({ by: ["status"], _count: true }),
    prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        reference: true,
        donorName: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.application.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
  ]);

  const count = (status) =>
    byStatus.find((row) => row.status === status)?._count ?? 0;

  const needsAttention = count("PROCESSING") + count("PENDING");

  return (
    <div>
      <h1 className="mb-8 text-3xl font-extrabold text-black font-[var(--font-heading)]">
        Overview
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total raised"
          value={`TSh ${TZS.format(paid._sum.amount ?? 0)}`}
          hint={`${paid._count} confirmed ${paid._count === 1 ? "gift" : "gifts"}`}
          accent
        />
        <Stat label="Awaiting confirmation" value={needsAttention} hint="Pending or processing" />
        <Stat
          label="New applications"
          value={newApplications}
          hint="Unread course applications"
          href="/admin/applications"
        />
        <Stat
          label="New messages"
          value={newMessages}
          hint="Unread contact enquiries"
          href="/admin/messages"
        />
      </div>

      <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-extrabold text-black">Recent donations</h2>
          <Link href="/admin/donations" className="text-sm font-bold text-primary">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="py-8 text-center text-black/50">No donations yet.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {recent.map((d) => (
              <li key={d.reference} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin/donations/${d.reference}`}
                    className="block truncate font-bold text-black hover:text-primary"
                  >
                    {d.donorName}
                  </Link>
                  <div className="text-xs text-black/50">
                    {d.reference} · {d.createdAt.toLocaleDateString("en-GB")}
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-4">
                  <span className="font-bold text-black">
                    TSh {TZS.format(d.amount)}
                  </span>
                  <StatusPill status={d.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, hint, accent, href }) {
  const body = (
    <>
      <div
        className={`text-xs font-bold uppercase tracking-wider ${
          accent ? "text-white/70" : "text-black/50"
        }`}
      >
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold">{value}</div>
      <div className={`mt-1 text-xs ${accent ? "text-white/60" : "text-black/40"}`}>
        {hint}
      </div>
    </>
  );

  const className = `block rounded-2xl border p-6 ${
    accent ? "border-primary/20 bg-primary text-white" : "border-black/10 bg-white"
  } ${href ? "transition-colors hover:border-primary/40" : ""}`;

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
