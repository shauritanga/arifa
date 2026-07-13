import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import StatusActions from "../status-actions";

export const dynamic = "force-dynamic";

const TABS = ["NEW", "READ", "ARCHIVED"];

export default async function MessagesPage({ searchParams }) {
  const params = await searchParams;
  const status = TABS.includes(params?.status) ? params.status : "NEW";

  const [messages, counts] = await Promise.all([
    prisma.contactMessage.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.contactMessage.groupBy({ by: ["status"], _count: true }),
  ]);

  const countOf = (s) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-extrabold text-black font-[var(--font-heading)]">
        Messages
      </h1>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t}
            href={`/admin/messages?status=${t}`}
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

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white py-16 text-center text-black/50">
          No {status.toLowerCase()} messages.
        </div>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-extrabold text-black">
                    {m.firstName} {m.lastName}
                  </h2>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/50">
                    <a
                      href={`mailto:${m.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {m.email}
                    </a>
                    {m.phone && <span>{m.phone}</span>}
                    <span>{m.createdAt.toLocaleString("en-GB")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {m.subject}
                  </span>
                  <StatusActions kind="message" id={m.id} status={m.status} />
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-black/70">
                {m.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
