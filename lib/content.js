import { prisma } from "./prisma";

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
    group: {
      label: "Section",
      options: ["Board of Directors", "Leadership", "Staff", "Researchers"],
    },
    fields: [{ key: "bio", label: "Biography", kind: "textarea" }],
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
    fields: [
      { key: "desc", label: "Description", kind: "textarea", required: true },
      { key: "duration", label: "Duration", kind: "text" },
      { key: "level", label: "Level", kind: "text" },
      { key: "format", label: "Format", kind: "text" },
    ],
  },

  JOB: {
    label: "Careers",
    singular: "Job opening",
    fields: [
      { key: "department", label: "Department", kind: "text" },
      { key: "location", label: "Location", kind: "text" },
      { key: "type", label: "Type", kind: "text" },
    ],
  },

  EVENT: {
    label: "Events",
    singular: "Event",
    group: { label: "Status", options: ["Upcoming", "Past"] },
    fields: [
      { key: "desc", label: "Description", kind: "textarea", required: true },
      { key: "location", label: "Location", kind: "text" },
      { key: "day", label: "Day", kind: "text" },
      { key: "month", label: "Month", kind: "text" },
      { key: "year", label: "Year", kind: "text" },
    ],
  },
};

export const COLLECTION_KEYS = Object.keys(COLLECTIONS);

export function isCollection(key) {
  return Object.hasOwn(COLLECTIONS, key);
}

/**
 * Flatten a ContentItem into the shape the page markup already expects, so the
 * public components keep working on plain objects rather than learning about
 * the ContentItem envelope.
 */
export function flatten(item) {
  return {
    id: item.slug ?? item.id,
    title: item.title,
    ...(item.image != null ? { image: item.image } : {}),
    ...(item.group != null ? { group: item.group } : {}),
    ...item.data,
  };
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
