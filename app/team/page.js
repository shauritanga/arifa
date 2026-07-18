import { getGrouped } from "@/lib/content";
import TeamPage from "./team-client";

export const dynamic = "force-dynamic";

/** Strip tags then truncate for card blurb when shortBio is missing. */
function deriveShortBio(bio, max = 160) {
  const text = String(bio || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

export default async function Team() {
  const grouped = await getGrouped("TEAM_MEMBER");

  // Preserve admin order; skip empty/unnamed sections.
  const team = Object.fromEntries(
    [...grouped]
      .filter(([section, members]) => section && members.length > 0)
      .map(([section, members]) => [
        section,
        members.map((m) => ({
          name: m.title,
          role: m.role || "",
          shortBio: m.shortBio || deriveShortBio(m.bio),
          bio: m.bio || m.shortBio || "",
          image: m.image || "",
        })),
      ]),
  );

  return <TeamPage team={team} />;
}
