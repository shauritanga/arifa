/**
 * ICAFoW 2026 campaign — single source of truth for on-site promotion.
 * Auto-hides after the conference ends (local TZ-agnostic date compare).
 */

export const ICAFOW = {
  shortName: "ICAFoW 2026",
  fullName:
    "International Conference on AI & the Future of Work (ICAFoW 2026)",
  tagline: "AI & the Future of Work — Reimagined for Africa",
  summary:
    "Join 1,000+ leaders, researchers, and innovators exploring how artificial intelligence is transforming industries, economies, and societies across Africa.",
  /** First day of the conference (inclusive). */
  startDate: "2026-09-24",
  /** Last day of the conference (inclusive). Campaign hides the day after. */
  endDate: "2026-09-26",
  dateLabel: "24 – 26 September 2026",
  location: "JNICC, Dar es Salaam, Tanzania",
  venueShort: "JNICC",
  url: "https://aiconference.arifa.org",
  registerUrl: "https://aiconference.arifa.org#registration",
  paperUrl: "https://aiconference.arifa.org",
  host: "Hosted by ARIFA · Pan-African AI Conference",
  stats: [
    { value: "100+", label: "Speakers" },
    { value: "1,000+", label: "Attendees" },
    { value: "10", label: "Tracks" },
    { value: "50+", label: "Partners" },
  ],
  dismissKey: "icafow-2026-announce-dismissed",
  /** Compressed conference atmosphere video for the homepage feature band. */
  videoBg: "/videos/icafow-conference-bg.mp4",
  videoPoster: "/hero-bg.png",
};

/** True while the campaign should run (before end of last conference day). */
export function isIcaFowCampaignActive(now = new Date()) {
  // Hide starting the calendar day after the event ends (UTC-safe via date strings).
  const endExclusive = new Date(`${ICAFOW.endDate}T23:59:59.999Z`);
  return now.getTime() <= endExclusive.getTime();
}
