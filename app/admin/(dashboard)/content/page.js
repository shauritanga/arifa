import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { COLLECTIONS, COLLECTION_KEYS } from "../../../../lib/content";

export const dynamic = "force-dynamic";

const META = {
  RESEARCH_PROJECT: {
    icon: "fa-flask",
    color: "bg-violet-500/10 text-violet-700",
    desc: "Research projects and case studies on the public site.",
  },
  TEAM_MEMBER: {
    icon: "fa-users",
    color: "bg-sky-500/10 text-sky-700",
    desc: "People listed under Team by category.",
  },
  CERTIFICATION: {
    icon: "fa-certificate",
    color: "bg-amber-500/10 text-amber-700",
    desc: "Certification programmes and curricula.",
  },
  MASTERCLASS: {
    icon: "fa-chalkboard-user",
    color: "bg-rose-500/10 text-rose-700",
    desc: "Master Class cities, dates, and fees.",
  },
  PUBLICATION: {
    icon: "fa-book",
    color: "bg-emerald-500/10 text-emerald-700",
    desc: "Papers and publications archive.",
  },
  COURSE: {
    icon: "fa-graduation-cap",
    color: "bg-indigo-500/10 text-indigo-700",
    desc: "Short courses and training offerings.",
  },
  JOB: {
    icon: "fa-briefcase",
    color: "bg-orange-500/10 text-orange-700",
    desc: "Open roles on the Careers page.",
  },
  EVENT: {
    icon: "fa-calendar-days",
    color: "bg-primary/10 text-primary",
    desc: "Events, news, and engagements with galleries.",
  },
};

export default async function ContentIndexPage() {
  const [counts, publishedCounts] = await Promise.all([
    prisma.contentItem.groupBy({ by: ["collection"], _count: true }),
    prisma.contentItem.groupBy({
      by: ["collection"],
      where: { published: true },
      _count: true,
    }),
  ]);

  const countOf = (key) =>
    counts.find((c) => c.collection === key)?._count ?? 0;
  const liveOf = (key) =>
    publishedCounts.find((c) => c.collection === key)?._count ?? 0;

  const total = counts.reduce((n, c) => n + c._count, 0);
  const liveTotal = publishedCounts.reduce((n, c) => n + c._count, 0);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-primary">
            CMS
          </p>
          <h1 className="text-xl font-bold text-black font-[var(--font-heading)] sm:text-2xl">
            Content library
          </h1>
          <p className="mt-1.5 max-w-xl text-xs text-black/55 sm:text-sm">
            Manage everything the public site shows. Edits go live as soon as you
            publish.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <div className="rounded-lg border border-black/10 bg-white px-3 py-2">
            <p className="text-[0.65rem] font-medium text-black/45">Total</p>
            <p className="text-base font-bold text-black">{total}</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white px-3 py-2">
            <p className="text-[0.65rem] font-medium text-black/45">Published</p>
            <p className="text-base font-bold text-emerald-700">{liveTotal}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {COLLECTION_KEYS.map((key) => {
          const meta = META[key] || {
            icon: "fa-folder",
            color: "bg-black/5 text-black/60",
            desc: "",
          };
          const totalItems = countOf(key);
          const live = liveOf(key);
          const draft = totalItems - live;

          return (
            <Link
              key={key}
              href={`/admin/content/${key}`}
              className="group flex flex-col rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm ${meta.color}`}
                >
                  <i className={`fas ${meta.icon}`} />
                </span>
                <i className="fas fa-arrow-right text-[0.65rem] text-black/25 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <h2 className="text-sm font-bold text-black sm:text-base">
                {COLLECTIONS[key].label}
              </h2>
              <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-black/50">
                {meta.desc}
              </p>
              <div className="mt-4 flex items-center gap-2 border-t border-black/5 pt-3 text-[0.7rem] font-semibold">
                <span className="text-black/65">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
                <span className="text-black/20">·</span>
                <span className="text-emerald-700">{live} live</span>
                {draft > 0 && (
                  <>
                    <span className="text-black/20">·</span>
                    <span className="text-amber-700">{draft} draft</span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
