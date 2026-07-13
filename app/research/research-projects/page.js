import { getCollection } from "@/lib/content";
import ResearchProjects from "./projects-client";

export const dynamic = "force-dynamic";

export default async function ResearchProjectsPage() {
  const projects = await getCollection("RESEARCH_PROJECT");
  return <ResearchProjects projects={projects} />;
}
