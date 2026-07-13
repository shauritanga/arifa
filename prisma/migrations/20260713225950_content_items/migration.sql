-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "group" TEXT,
    "data" JSONB NOT NULL DEFAULT '{}',
    "position" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentItem_collection_published_position_idx" ON "ContentItem"("collection", "published", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ContentItem_collection_slug_key" ON "ContentItem"("collection", "slug");
