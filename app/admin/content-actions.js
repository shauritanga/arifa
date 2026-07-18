"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/auth";
import { COLLECTIONS, isCollection } from "../../lib/content";
import { orderCertificationSections } from "../../lib/html";

/**
 * Public pages read straight from the database, so an edit has to invalidate
 * whatever pages render that collection. Mapped explicitly rather than guessed.
 */
const PUBLIC_PATHS = {
  RESEARCH_PROJECT: ["/research/research-projects"],
  TEAM_MEMBER: ["/team"],
  CERTIFICATION: ["/training/certifications"],
  PUBLICATION: ["/publications"],
  COURSE: ["/training/short-courses"],
  JOB: ["/opportunities/careers"],
  EVENT: ["/events", "/events/engagements"],
};

function revalidateFor(collection, slug) {
  for (const path of PUBLIC_PATHS[collection] ?? []) {
    revalidatePath(path);
    if (slug) revalidatePath(`${path}/${slug}`);
  }
  // Event detail lives at /events/<slug>
  if (collection === "EVENT" && slug) {
    revalidatePath(`/events/${slug}`);
  }
  revalidatePath(`/admin/content/${collection}`);
}

/** One URL/path (or tag) per non-empty line → string[]. */
function readLines(raw) {
  return String(raw || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Build the `data` blob from the collection's declared fields. */
function readFields(collection, formData) {
  const data = {};

  for (const field of COLLECTIONS[collection].fields) {
    const raw = String(formData.get(field.key) ?? "").trim();

    if (field.kind === "json" || field.kind === "sections") {
      if (!raw) {
        data[field.key] = [];
        continue;
      }
      try {
        const parsed = JSON.parse(raw);
        let list = Array.isArray(parsed) ? parsed : [];
        // Public certification page always shows core modules last.
        if (field.kind === "sections" && collection === "CERTIFICATION") {
          list = orderCertificationSections(list);
        }
        data[field.key] = list;
      } catch {
        return {
          error:
            field.kind === "sections"
              ? `${field.label} could not be saved. Please try again.`
              : `${field.label} must be valid JSON.`,
        };
      }
      continue;
    }

    if (field.kind === "lines") {
      const lines = readLines(raw);
      if (field.required && lines.length === 0) {
        return { error: `${field.label} is required.` };
      }
      data[field.key] = lines;
      continue;
    }

    if (field.kind === "html") {
      const textOnly = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (field.required && !textOnly) {
        return { error: `${field.label} is required.` };
      }
      data[field.key] = raw;
      continue;
    }

    if (field.required && !raw) {
      return { error: `${field.label} is required.` };
    }
    data[field.key] = raw;
  }

  return { data };
}

export async function saveContentItem(collection, id, formData) {
  await requireAdmin();

  if (!isCollection(collection)) {
    return { ok: false, error: "Unknown collection." };
  }
  const spec = COLLECTIONS[collection];

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { ok: false, error: `${spec.titleLabel ?? "Title"} is required.` };
  }

  const { data, error } = readFields(collection, formData);
  if (error) return { ok: false, error };

  let slug = String(formData.get("slug") ?? "").trim() || null;
  if (spec.hasSlug && !slug) {
    slug = slugify(title) || null;
  }
  let image = String(formData.get("image") ?? "").trim() || null;
  // Cover falls back to first gallery image so listings always have a photo.
  if (!image && Array.isArray(data.images) && data.images[0]) {
    image = data.images[0];
  }
  // Prefer free-text custom group when the form sent both (category + custom).
  const groupCustom = String(formData.get("groupCustom") ?? "").trim();
  const groupSelect = String(formData.get("group") ?? "").trim();
  const group =
    (groupSelect === "__custom__" ? groupCustom : groupCustom || groupSelect) ||
    null;

  if (spec.group?.required && !group) {
    return {
      ok: false,
      error: `${spec.group.label ?? "Category"} is required.`,
    };
  }

  const published = formData.get("published") === "on";

  const values = { title, image, group, data, published };

  try {
    if (id === "new") {
      // New items go to the end of their collection.
      const last = await prisma.contentItem.findFirst({
        where: { collection },
        orderBy: { position: "desc" },
        select: { position: true },
      });

      await prisma.contentItem.create({
        data: {
          ...values,
          collection,
          slug: spec.hasSlug ? slug : null,
          position: (last?.position ?? -1) + 1,
        },
      });
    } else {
      await prisma.contentItem.update({
        where: { id },
        data: { ...values, ...(spec.hasSlug ? { slug } : {}) },
      });
    }
  } catch (err) {
    // The only unique constraint is (collection, slug).
    if (err.code === "P2002") {
      return { ok: false, error: "Another item already uses that URL slug." };
    }
    console.error("[content] save failed", collection, id, err);
    return { ok: false, error: "Could not save. Please try again." };
  }

  revalidateFor(collection, slug);
  return { ok: true };
}

export async function deleteContentItem(collection, id) {
  await requireAdmin();
  if (!isCollection(collection)) return { ok: false, error: "Unknown collection." };

  const item = await prisma.contentItem.findUnique({ where: { id } });
  if (!item) return { ok: false, error: "Item not found." };

  await prisma.contentItem.delete({ where: { id } });
  revalidateFor(collection, item.slug);
  return { ok: true };
}

export async function toggleContentPublished(collection, id) {
  await requireAdmin();
  if (!isCollection(collection)) return { ok: false, error: "Unknown collection." };

  const item = await prisma.contentItem.findUnique({ where: { id } });
  if (!item) return { ok: false, error: "Item not found." };

  await prisma.contentItem.update({
    where: { id },
    data: { published: !item.published },
  });

  revalidateFor(collection, item.slug);
  return { ok: true };
}

/**
 * Move an item one place up or down, by swapping positions with its neighbour.
 * Ordering is per-collection and drives the order on the public page.
 */
export async function moveContentItem(collection, id, direction) {
  await requireAdmin();
  if (!isCollection(collection)) return { ok: false, error: "Unknown collection." };

  const items = await prisma.contentItem.findMany({
    where: { collection },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    select: { id: true, position: true },
  });

  const index = items.findIndex((i) => i.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) {
    return { ok: true }; // already at the end — nothing to do
  }

  // Positions may have collided or drifted, so rewrite the whole order rather
  // than swapping two possibly-equal numbers.
  const reordered = [...items];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

  await prisma.$transaction(
    reordered.map((item, position) =>
      prisma.contentItem.update({ where: { id: item.id }, data: { position } }),
    ),
  );

  revalidateFor(collection, null);
  return { ok: true };
}
