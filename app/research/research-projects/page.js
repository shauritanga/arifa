import { getCollection } from "@/lib/content";
import ResearchProjects from "./projects-client";

export const dynamic = "force-dynamic";

/** Plain-text card blurb from rich project HTML. */
function excerptFromContent(html, max = 160) {
  const text = String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

export default async function ResearchProjectsPage() {
  const items = await getCollection("RESEARCH_PROJECT");
  const projects = items.map((p) => ({
    id: p.id,
    title: p.title,
    image: p.image || "/hero-bg.png",
    category: p.group || "",
    dateRange: p.dateRange || "",
    excerpt: excerptFromContent(p.content),
  }));

  return <ResearchProjects projects={projects} />;
}
