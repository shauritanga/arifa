import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../../lib/prisma";
import { COLLECTIONS, isCollection } from "../../../../../../lib/content";
import ContentForm from "./content-form";

export const dynamic = "force-dynamic";

export default async function EditContentPage({ params }) {
  const { collection, id } = await params;
  if (!isCollection(collection)) notFound();

  const spec = COLLECTIONS[collection];
  const isNew = id === "new";

  const item = isNew
    ? { id: "new", data: {}, published: true }
    : await prisma.contentItem.findUnique({ where: { id } });

  if (!item || (!isNew && item.collection !== collection)) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href={`/admin/content/${collection}`}
        className="mb-6 inline-block text-sm font-bold text-black/50 hover:text-primary"
      >
        ← {spec.label}
      </Link>

      <h1 className="mb-8 text-3xl font-extrabold text-black font-[var(--font-heading)]">
        {isNew ? `New ${spec.singular.toLowerCase()}` : item.title}
      </h1>

      <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <ContentForm collection={collection} spec={spec} item={item} />
      </div>
    </div>
  );
}
