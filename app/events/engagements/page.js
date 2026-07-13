import { getCollection } from "@/lib/content";
import Engagements from "./engagements-client";

export const dynamic = "force-dynamic";

/** The client splits on `type` (Upcoming / Past), which is stored as the group. */
export default async function EngagementsPage() {
  const items = await getCollection("EVENT");

  const engagements = items.map((e) => ({
    day: e.day,
    month: e.month,
    year: e.year,
    title: e.title,
    location: e.location,
    desc: e.desc,
    type: e.group,
  }));

  return <Engagements engagements={engagements} />;
}
