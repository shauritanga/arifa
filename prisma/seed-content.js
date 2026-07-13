/**
 * Seed the site's content from prisma/content-seed.json.
 *
 * That file is the migrated content: it was extracted once from the JSON files in
 * app/data and from the inline arrays that used to live inside the page files.
 * Those sources are gone now — the database is authoritative and the pages read from
 * it — so this seed reads the snapshot rather than the (now dataless) pages.
 *
 * Idempotent: items are upserted on (collection, slug), so re-running restores
 * the shipped content without duplicating it.
 *
 * It does NOT delete anything. Content added or edited through the dashboard is
 * left alone, except where it shares a slug with a seeded item — re-running is a
 * way to reset the shipped content to its original state, not to wipe the site.
 */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const items = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "prisma", "content-seed.json"), "utf8"),
  );

  const counts = {};

  for (const item of items) {
    await prisma.contentItem.upsert({
      where: {
        collection_slug: { collection: item.collection, slug: item.slug },
      },
      update: {
        title: item.title,
        image: item.image,
        group: item.group,
        data: item.data,
        position: item.position,
        published: item.published,
      },
      create: item,
    });
    counts[item.collection] = (counts[item.collection] ?? 0) + 1;
  }

  console.log("Content seeded →");
  for (const [collection, n] of Object.entries(counts)) {
    console.log(`  ${collection.padEnd(18)} ${n}`);
  }
  console.log(`\n${await prisma.contentItem.count()} content items in the database.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
