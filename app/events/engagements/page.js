import { getCollection } from "@/lib/content";
import Engagements from "./engagements-client";

export const dynamic = "force-dynamic";

export default async function EngagementsPage() {
  const items = await getCollection("EVENT");

  const engagements = items.map((e) => {
    const gallery = Array.isArray(e.images) ? e.images.filter(Boolean) : [];
    return {
      id: e.id,
      slug: e.slug || e.id,
      day: e.day || "",
      month: e.month || "",
      year: e.year || "",
      endDay: e.endDay || e.day || "",
      endMonth: e.endMonth || e.month || "",
      endYear: e.endYear || e.year || "",
      title: e.title,
      location: e.location || "",
      desc: e.desc || "",
      kind: e.kind || "Event",
      image: e.image || gallery[0] || "",
      type: e.group || "Past",
      registerUrl: e.registerUrl || "",
    };
  });

  return <Engagements engagements={engagements} />;
}
