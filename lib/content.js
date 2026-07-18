import { prisma } from "./prisma";
import { balanceHtml, normalizeText } from "./html";

export { balanceHtml, normalizeText } from "./html";

/**
 * The shape of every editable collection, declared once.
 *
 * This drives both the admin forms (which fields to render, and how) and the
 * public reads. `fields` are the type-specific keys stored in ContentItem.data;
 * title / image / group / slug are columns because they are common or indexed.
 *
 * Field kinds: text | textarea | html | url
 */
export const COLLECTIONS = {
  RESEARCH_PROJECT: {
    label: "Research Projects",
    singular: "Research project",
    // Addressable at /research/research-projects/<slug>.
    hasSlug: true,
    hasImage: true,
    fields: [{ key: "content", label: "Content", kind: "html", required: true }],
  },

  TEAM_MEMBER: {
    label: "Team",
    singular: "Team member",
    titleLabel: "Name",
    hasImage: true,
    // Category on the public /team page. Admins can pick a known section or
    // type a new one (see allowCustom on the content form).
    group: {
      label: "Category",
      required: true,
      allowCustom: true,
      options: ["Board of Directors", "Leadership", "Staff", "Researchers"],
    },
    fields: [
      {
        key: "role",
        label: "Title / role",
        kind: "text",
        hint: "Shown under the name on the team card (e.g. Director of Research).",
      },
      {
        key: "shortBio",
        label: "Short description",
        kind: "textarea",
        hint: "One or two sentences for the team card. Keep it brief.",
      },
      {
        key: "bio",
        label: "Full biography",
        kind: "textarea",
        required: true,
        hint: "Shown when visitors click View Bio.",
      },
    ],
  },

  CERTIFICATION: {
    label: "Certifications",
    singular: "Certification",
    hasSlug: true,
    hasImage: true,
    group: { label: "Category" },
    fields: [
      { key: "desc", label: "Short description", kind: "textarea", required: true },
      { key: "sections", label: "Detail sections", kind: "json" },
      { key: "view_url", label: "View URL", kind: "url" },
      { key: "apply_url", label: "Apply URL", kind: "url" },
    ],
  },

  MASTERCLASS: {
    label: "Master Class",
    singular: "Master class session",
    titleLabel: "City",
    hasImage: true,
    fields: [
      { key: "country", label: "Country", kind: "text", required: true },
      { key: "date", label: "Dates", kind: "text", required: true },
      { key: "format", label: "Format", kind: "text" },
      { key: "early_price", label: "Early bird price", kind: "text" },
      { key: "standard_price", label: "Standard price", kind: "text" },
      { key: "group_price", label: "Group price (3+), per person", kind: "text" },
      // The prices above are display only. This is the amount actually charged:
      // Airpay bills Tanzanian shillings, so a seat cannot be sold until it has
      // one. Left empty, the city takes enquiries instead of payments.
      {
        key: "fee_tzs",
        label: "Fee charged at checkout (TZS, whole shillings)",
        kind: "text",
      },
      { key: "desc", label: "Short description", kind: "textarea", required: true },
      { key: "register_url", label: "Register URL", kind: "url" },
    ],
  },

  PUBLICATION: {
    label: "Publications",
    singular: "Publication",
    group: { label: "Year" },
    fields: [
      { key: "authors", label: "Authors", kind: "text", required: true },
      { key: "venue", label: "Venue", kind: "text", required: true },
      { key: "link", label: "Link", kind: "url" },
    ],
  },

  COURSE: {
    label: "Short Courses",
    singular: "Short course",
    hasSlug: true,
    hasImage: true,
    fields: [
      { key: "date", label: "Date", kind: "text" },
      { key: "location", label: "Location", kind: "text" },
      { key: "certificate", label: "Certificate", kind: "text" },
      { key: "period", label: "Period (sidebar filter)", kind: "text" },
      { key: "price", label: "Price (display, e.g. 200,000 Tsh)", kind: "text" },
      // Display prices above are marketing copy. This is the amount actually
      // charged: Airpay bills whole Tanzanian shillings, so a course cannot be
      // enrolled online until it has one. Left empty, Enroll goes to enquiry.
      {
        key: "price_tzs",
        label: "Fee charged at checkout (TZS, whole shillings)",
        kind: "text",
      },
      { key: "desc", label: "Description", kind: "textarea" },
    ],
  },

  JOB: {
    label: "Careers",
    singular: "Job opening",
    fields: [
      { key: "department", label: "Department", kind: "text" },
      { key: "location", label: "Location", kind: "text" },
      { key: "type", label: "Type", kind: "text", hint: "e.g. Full-Time, Contract, Internship" },
      {
        key: "shortDesc",
        label: "Short description",
        kind: "textarea",
        required: true,
        hint: "Shown on the closed career card (1–2 sentences).",
      },
      {
        key: "details",
        label: "Full details",
        kind: "textarea",
        required: true,
        hint: "Shown when visitors click View more (responsibilities, requirements, etc.).",
      },
    ],
  },

  EVENT: {
    label: "Events",
    singular: "Event / news post",
    titleLabel: "Event title",
    hasSlug: true,
    hasImage: true,
    imageLabel: "Cover image",
    imageHint: "Main photo for the listing card and detail banner. Upload from your device.",
    group: {
      label: "Status",
      required: true,
      options: ["Upcoming", "Past"],
    },
    fields: [
      {
        key: "kind",
        label: "Type",
        kind: "select",
        options: ["Event", "News", "Announcement", "Workshop", "Conference"],
        hint: "Badge on the listing card and detail page.",
      },
      {
        key: "location",
        label: "Location",
        kind: "text",
        hint: "Venue or city (e.g. Super Dome, Dar es Salaam).",
      },
      {
        key: "day",
        label: "Start day",
        kind: "text",
        required: true,
        hint: "Day number, e.g. 15",
      },
      {
        key: "month",
        label: "Start month",
        kind: "text",
        required: true,
        hint: "Short or full month, e.g. Jul or July",
      },
      {
        key: "year",
        label: "Start year",
        kind: "text",
        required: true,
        hint: "e.g. 2026",
      },
      {
        key: "endDay",
        label: "End day",
        kind: "text",
        hint: "Optional — leave blank if same as start.",
      },
      {
        key: "endMonth",
        label: "End month",
        kind: "text",
        hint: "Optional",
      },
      {
        key: "endYear",
        label: "End year",
        kind: "text",
        hint: "Optional",
      },
      {
        key: "organizer",
        label: "Organizer",
        kind: "text",
        hint: "Optional — e.g. ARIFA, ICT Commission",
      },
      {
        key: "registerUrl",
        label: "Registration / external link",
        kind: "url",
        hint: "Optional link for tickets or partner page.",
      },
      {
        key: "images",
        label: "Gallery images",
        kind: "lines",
        hint: "Upload multiple photos for the detail page gallery (in addition to the cover).",
      },
      {
        key: "tags",
        label: "Tags",
        kind: "lines",
        hint: "One tag per line (e.g. AI, Partnership, Training).",
      },
      {
        key: "desc",
        label: "Short summary",
        kind: "textarea",
        required: true,
        hint: "1–3 sentences for the listing card.",
      },
      {
        key: "content",
        label: "Full story / details",
        kind: "textarea",
        required: true,
        hint: "Full write-up on the event detail page. Separate paragraphs with a blank line.",
      },
    ],
  },
};

export const COLLECTION_KEYS = Object.keys(COLLECTIONS);

export function isCollection(key) {
  return Object.hasOwn(COLLECTIONS, key);
}

function normalizeDeep(value) {
  if (typeof value === "string") return normalizeText(value);
  if (Array.isArray(value)) return value.map(normalizeDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const [key, child] of Object.entries(value)) {
      out[key] = normalizeDeep(child);
    }
    return out;
  }
  return value;
}

/**
 * Flatten a ContentItem into the shape the page markup already expects, so the
 * public components keep working on plain objects rather than learning about
 * the ContentItem envelope.
 */
export function flatten(item) {
  const flat = normalizeDeep({
    id: item.slug ?? item.id,
    title: item.title,
    ...(item.image != null ? { image: item.image } : {}),
    ...(item.group != null ? { group: item.group } : {}),
    ...item.data,
  });

  // Repair HTML fragments that would otherwise break page structure.
  if (typeof flat.content === "string") {
    flat.content = balanceHtml(flat.content);
  }
  if (Array.isArray(flat.sections)) {
    flat.sections = flat.sections.map((section) => ({
      ...section,
      content:
        typeof section?.content === "string"
          ? balanceHtml(section.content)
          : section?.content,
    }));
  }

  return flat;
}

/** Published items of a collection, in admin-defined order. */
export async function getCollection(collection) {
  const items = await prisma.contentItem.findMany({
    where: { collection, published: true },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  return items.map(flatten);
}

/** One published item by its slug, or null. */
export async function getBySlug(collection, slug) {
  const item = await prisma.contentItem.findFirst({
    where: { collection, slug, published: true },
  });
  return item ? flatten(item) : null;
}

/**
 * Published items grouped by their `group` column, preserving admin order both
 * between groups (first appearance) and within them.
 */
export async function getGrouped(collection) {
  const items = await getCollection(collection);
  const groups = new Map();

  for (const item of items) {
    const key = item.group ?? "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }

  return groups;
}
