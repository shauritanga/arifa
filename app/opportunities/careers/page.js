import { getCollection } from "@/lib/content";
import Careers from "./careers-client";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const jobs = await getCollection("JOB");
  return <Careers jobs={jobs} />;
}
