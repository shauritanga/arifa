import { getGrouped } from "@/lib/content";
import TeamPage from "./team-client";

export const dynamic = "force-dynamic";

/** The client renders a tab per section, each member as { name, bio, image }. */
export default async function Team() {
  const grouped = await getGrouped("TEAM_MEMBER");

  const team = Object.fromEntries(
    [...grouped].map(([section, members]) => [
      section,
      members.map((m) => ({ name: m.title, bio: m.bio, image: m.image })),
    ]),
  );

  return <TeamPage team={team} />;
}
