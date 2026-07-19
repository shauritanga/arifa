import { getCollection } from "@/lib/content";
import Publications from "./publications-client";

export const dynamic = "force-dynamic";

const CATEGORY_ORDER = [
  "Research Reports",
  "Policy Briefs",
  "Concept Notes",
  "Books",
  "ARIFA Journal",
];

export default async function PublicationsPage() {
  const items = await getCollection("PUBLICATION");

  const publications = items.map((p) => ({
    // flatten() sets id to slug when present — use for on-site detail URLs.
    id: p.id,
    slug: p.id,
    title: p.title,
    image: p.image || "",
    category: p.group || "Research Reports",
    year: p.year || "",
    authors: p.authors || "",
    venue: p.venue || "",
    // Optional external PDF/resource only — cards open /publications/[slug].
    link: p.link || "",
  }));

  // Stable category list for tabs — include empty original types.
  const present = new Set(publications.map((p) => p.category).filter(Boolean));
  const categories = [
    ...CATEGORY_ORDER,
    ...[...present].filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <Publications publications={publications} categories={categories} />
  );
}
