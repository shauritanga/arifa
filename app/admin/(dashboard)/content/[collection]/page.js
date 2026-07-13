import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/prisma";
import { COLLECTIONS, isCollection } from "../../../../../lib/content";
import ItemRow from "./item-row";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }) {
  const { collection } = await params;
  if (!isCollection(collection)) notFound();

  const spec = COLLECTIONS[collection];
  const items = await prisma.contentItem.findMany({
    where: { collection },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <Link
        href="/admin/content"
        className="mb-6 inline-block text-sm font-bold text-black/50 hover:text-primary"
      >
        ← All content
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black font-[var(--font-heading)]">
            {spec.label}
          </h1>
          <p className="mt-1 text-sm text-black/50">
            {items.length} {items.length === 1 ? "item" : "items"} · drag order
            with the arrows; it is the order shown on the site
          </p>
        </div>
        <Link
          href={`/admin/content/${collection}/new`}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
        >
          <i className="fas fa-plus mr-2" />
          Add {spec.singular.toLowerCase()}
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white py-16 text-center text-black/50">
          Nothing here yet.
        </div>
      ) : (
        <ul className="divide-y divide-black/5 rounded-2xl border border-black/10 bg-white">
          {items.map((item, i) => (
            <ItemRow
              key={item.id}
              collection={collection}
              item={item}
              isFirst={i === 0}
              isLast={i === items.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
