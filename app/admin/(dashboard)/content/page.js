import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import { COLLECTIONS, COLLECTION_KEYS } from "../../../../lib/content";

export const dynamic = "force-dynamic";

export default async function ContentIndexPage() {
  const counts = await prisma.contentItem.groupBy({
    by: ["collection"],
    _count: true,
  });

  const countOf = (key) =>
    counts.find((c) => c.collection === key)?._count ?? 0;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-extrabold text-black font-[var(--font-heading)]">
        Content
      </h1>
      <p className="mb-8 text-black/60">
        Everything the public site shows. Changes appear immediately.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTION_KEYS.map((key) => (
          <Link
            key={key}
            href={`/admin/content/${key}`}
            className="rounded-2xl border border-black/10 bg-white p-6 transition-colors hover:border-primary/40"
          >
            <div className="text-lg font-extrabold text-black">
              {COLLECTIONS[key].label}
            </div>
            <div className="mt-1 text-sm text-black/50">
              {countOf(key)} {countOf(key) === 1 ? "item" : "items"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
