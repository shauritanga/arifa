import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/prisma";
import { COLLECTIONS, isCollection } from "../../../../../lib/content";
import CollectionClient from "./collection-client";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }) {
  const { collection } = await params;
  if (!isCollection(collection)) notFound();

  const spec = COLLECTIONS[collection];
  const items = await prisma.contentItem.findMany({
    where: { collection },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  // Serialize dates for the client
  const serialized = items.map((item) => ({
    ...item,
    createdAt: item.createdAt?.toISOString?.() ?? item.createdAt,
    updatedAt: item.updatedAt?.toISOString?.() ?? item.updatedAt,
  }));

  return (
    <CollectionClient
      collection={collection}
      spec={spec}
      items={serialized}
    />
  );
}
