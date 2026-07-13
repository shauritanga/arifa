import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import StatusActions from "../status-actions";

export const dynamic = "force-dynamic";

const TABS = ["NEW", "READ", "ARCHIVED"];

export default async function ApplicationsPage({ searchParams }) {
  const params = await searchParams;
  const status = TABS.includes(params?.status) ? params.status : "NEW";

  const [applications, counts] = await Promise.all([
    prisma.application.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      take: 100,
      // cvData is deliberately not selected — the file is streamed by its own
      // route, so the list never pulls megabytes of CVs out of the database.
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        programme: true,
        occupation: true,
        motivation: true,
        cvName: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.application.groupBy({ by: ["status"], _count: true }),
  ]);

  const countOf = (s) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-extrabold text-black font-[var(--font-heading)]">
        Applications
      </h1>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t}
            href={`/admin/applications?status=${t}`}
            className={`rounded-xl px-4 py-2 text-sm font-bold capitalize transition-colors ${
              t === status
                ? "bg-primary text-white"
                : "border border-black/10 bg-white text-black/60 hover:bg-black/5"
            }`}
          >
            {t.toLowerCase()} ({countOf(t)})
          </Link>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white py-16 text-center text-black/50">
          No {status.toLowerCase()} applications.
        </div>
      ) : (
        <ul className="space-y-4">
          {applications.map((a) => (
            <li
              key={a.id}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-extrabold text-black">
                    {a.firstName} {a.lastName}
                  </h2>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/50">
                    <a
                      href={`mailto:${a.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {a.email}
                    </a>
                    <span>{a.phone}</span>
                    {a.occupation && <span>{a.occupation}</span>}
                    <span>{a.createdAt.toLocaleString("en-GB")}</span>
                  </div>
                </div>
                <StatusActions kind="application" id={a.id} status={a.status} />
              </div>

              <div className="mb-3 rounded-xl bg-primary/5 px-4 py-2 text-sm font-bold text-primary">
                {a.programme}
              </div>

              <p className="whitespace-pre-wrap text-sm leading-relaxed text-black/70">
                {a.motivation}
              </p>

              {a.cvName && (
                <a
                  href={`/api/admin/applications/${a.id}/cv`}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-bold text-black/70 transition-colors hover:bg-black/5"
                >
                  <i className="fas fa-file-arrow-down" />
                  {a.cvName}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
