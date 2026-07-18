import { getGrouped } from "@/lib/content";
import HomeClient from "./home-client";

export const dynamic = "force-dynamic";

/** Strip tags then truncate for card blurb when shortBio is missing. */
function deriveShortBio(bio, max = 110) {
  const text = String(bio || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 60 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

function hasPortrait(image) {
  const src = String(image || "").trim();
  if (!src) return false;
  // Skip generic placeholder used when no photo was uploaded.
  return !/user_avatar/i.test(src);
}

export default async function Home() {
  const grouped = await getGrouped("TEAM_MEMBER");
  const board = grouped.get("Board of Directors") ?? [];

  // Spotlight a few directors on the homepage; full list lives on /team.
  // Prefer members with real portraits so the section does not open on a placeholder.
  const preferred = board.filter((m) => hasPortrait(m.image));
  const featured = (preferred.length >= 4 ? preferred : board).slice(0, 4);

  const boardMembers = featured.map((m) => ({
    name: m.title,
    role: m.role || "Team Expert",
    shortBio: m.shortBio || deriveShortBio(m.bio),
    bio: m.bio || m.shortBio || "",
    image: m.image || "",
  }));

  return <HomeClient boardMembers={boardMembers} />;
}
