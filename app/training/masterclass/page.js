import { getCollection } from "@/lib/content";
import { feeInShillings } from "@/lib/masterclass";
import Masterclass from "./masterclass-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Executive AI Masterclass | ARIFA",
  description:
    "A premier executive training for CEOs, government leaders, board members and senior decision-makers, running across ten African cities in 2026.",
};

export default async function MasterclassPage() {
  const sessions = await getCollection("MASTERCLASS");

  // A city can only be booked online once it has a shilling price; the card CTA
  // turns into an enquiry until then. Resolved here so the client component
  // never has to parse an admin-entered fee.
  const priced = sessions.map((session) => ({
    ...session,
    fee: feeInShillings(session),
  }));

  return <Masterclass sessions={priced} />;
}
