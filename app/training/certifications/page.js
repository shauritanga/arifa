import { getCollection } from "@/lib/content";
import Certifications from "./certifications-client";

export const dynamic = "force-dynamic";

/** The listing cards read `category`, which is stored as the group. */
export default async function CertificationsPage() {
  const items = await getCollection("CERTIFICATION");

  const certifications = items.map((c) => ({
    title: c.title,
    image: c.image,
    desc: c.desc,
    view_url: c.view_url,
    apply_url: c.apply_url,
    category: c.group,
  }));

  return <Certifications certifications={certifications} />;
}
