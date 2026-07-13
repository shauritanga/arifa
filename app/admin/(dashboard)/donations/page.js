import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import StatusPill from "../status-pill";

export const dynamic = "force-dynamic";

const TZS = new Intl.NumberFormat("en-TZ");
const STATUSES = ["ALL", "PAID", "PROCESSING", "PENDING", "FAILED", "CANCELLED"];
const PAGE_SIZE = 25;

export default async function DonationsPage({ searchParams }) {
  const params = await searchParams;
  const status = STATUSES.includes(params?.status) ? params.status : "ALL";
  const q = (params?.q || "").trim();
  const page = Math.max(1, Number(params?.page) || 1);

  const where = {
    ...(status === "ALL" ? {} : { status }),
    ...(q
      ? {
          OR: [
            { reference: { contains: q, mode: "insensitive" } },
            { donorName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { organization: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [donations, total] = await Promise.all([
    prisma.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.donation.count({ where }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (over) => {
    const sp = new URLSearchParams();
    if (status !== "ALL") sp.set("status", status);
    if (q) sp.set("q", q);
    Object.entries(over).forEach(([k, v]) => (v ? sp.set(k, v) : sp.delete(k)));
    const s = sp.toString();
    return s ? `?${s}` : "";
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-black font-[var(--font-heading)]">
          Donations{" "}
          <span className="text-lg font-bold text-black/40">({total})</span>
        </h1>
        <a
          href={`/api/admin/donations/export${qs({})}`}
          className="rounded-xl border border-primary px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <i className="fas fa-download mr-2" />
          Export CSV
        </a>
      </div>

      <form method="get" className="mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name, email, reference…"
          className="min-w-[240px] flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border border-black/10 bg-white px-4 py-3 font-medium outline-none focus:border-primary"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All statuses" : s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-primary px-6 py-3 font-bold text-white"
        >
          Filter
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase tracking-wider text-black/50">
            <tr>
              <th className="px-5 py-4 font-bold">Donor</th>
              <th className="px-5 py-4 font-bold">Reference</th>
              <th className="px-5 py-4 font-bold">Type</th>
              <th className="px-5 py-4 text-right font-bold">Amount</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 font-bold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {donations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-black/50">
                  No donations match this filter.
                </td>
              </tr>
            )}
            {donations.map((d) => (
              <tr key={d.id} className="hover:bg-primary/5">
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/donations/${d.reference}`}
                    className="font-bold text-black hover:text-primary"
                  >
                    {d.donorName}
                  </Link>
                  <div className="text-xs text-black/50">{d.email}</div>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-black/60">
                  {d.reference}
                </td>
                <td className="px-5 py-4 text-black/60">
                  {d.type === "SPONSORSHIP" ? "Sponsorship" : "Donation"}
                </td>
                <td className="px-5 py-4 text-right font-bold text-black">
                  TSh {TZS.format(d.amount)}
                </td>
                <td className="px-5 py-4">
                  <StatusPill status={d.status} />
                </td>
                <td className="px-5 py-4 text-black/60">
                  {d.createdAt.toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-black/50">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/donations${qs({ page: String(page - 1) })}`}
                className="rounded-lg border border-black/10 px-4 py-2 font-bold text-black/70 hover:bg-white"
              >
                Previous
              </Link>
            )}
            {page < pages && (
              <Link
                href={`/admin/donations${qs({ page: String(page + 1) })}`}
                className="rounded-lg border border-black/10 px-4 py-2 font-bold text-black/70 hover:bg-white"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
