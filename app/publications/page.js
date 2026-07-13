import { getGrouped } from "@/lib/content";
import Publications from "./publications-client";

export const dynamic = "force-dynamic";

/** Stored one row per paper; the page renders them grouped by year, newest first. */
export default async function PublicationsPage() {
  const grouped = await getGrouped("PUBLICATION");

  const publications = [...grouped]
    .map(([year, papers]) => ({
      year,
      papers: papers.map((p) => ({
        title: p.title,
        authors: p.authors,
        venue: p.venue,
        link: p.link,
      })),
    }))
    .sort((a, b) => Number(b.year) - Number(a.year));

  return <Publications publications={publications} />;
}
