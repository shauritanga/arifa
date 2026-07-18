import { getCollection } from "@/lib/content";
import IndustryEngagement from "./industry-client";

export const dynamic = "force-dynamic";

export default async function IndustryEngagementPage() {
  const items = await getCollection("SPONSOR");
  const sponsors = items
    .filter((s) => s.image)
    .map((s) => ({
      name: s.title,
      logo: s.image,
      url: s.url || "",
    }));

  return <IndustryEngagement sponsors={sponsors} />;
}
