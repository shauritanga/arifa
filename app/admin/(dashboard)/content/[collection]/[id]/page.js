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
    <div>
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs font-medium text-black/45">
        <Link href="/admin/content" className="hover:text-primary">
          Content
        </Link>
        <i className="fas fa-chevron-right text-[0.55rem] opacity-50" />
        <Link
          href={`/admin/content/${collection}`}
          className="hover:text-primary"
        >
          {spec.label}
        </Link>
        <i className="fas fa-chevron-right text-[0.55rem] opacity-50" />
        <span className="text-black/70">
          {isNew ? "New" : "Edit"}
        </span>
      </nav>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-black font-[var(--font-heading)] sm:text-xl">
            {isNew
              ? `New ${spec.singular.toLowerCase()}`
              : item.title || "Untitled"}
          </h1>
          <p className="mt-1 text-xs text-black/50">
            {isNew
              ? `Create a new ${spec.singular.toLowerCase()} for the public site.`
              : "Update fields, then save. Publish status is on the right."}
          </p>
        </div>
        {!isNew && item.published && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-semibold normal-case tracking-normal text-emerald-700 ring-1 ring-emerald-200/80">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            Live on site
          </span>
        )}
      </div>

      <ContentForm collection={collection} spec={spec} item={item} />
    </div>
  );
}
