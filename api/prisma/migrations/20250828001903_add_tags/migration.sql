/*
  Warnings:

  - You are about to drop the column `lyrics` on the `Music` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeUrl` on the `Music` table. All the data in the column will be lost.
  - You are about to drop the `Chord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Chord" DROP CONSTRAINT "Chord_musicId_fkey";

-- AlterTable
ALTER TABLE "public"."Artist" ADD COLUMN     "categoryId" TEXT;

-- AlterTable
ALTER TABLE "public"."Music" DROP COLUMN "lyrics",
DROP COLUMN "youtubeUrl",
ADD COLUMN     "content" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "videoUrl" TEXT;

-- DropTable
DROP TABLE "public"."Chord";

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MusicTag" (
    "musicId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MusicTag_pkey" PRIMARY KEY ("musicId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- AddForeignKey
ALTER TABLE "public"."Artist" ADD CONSTRAINT "Artist_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MusicTag" ADD CONSTRAINT "MusicTag_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "public"."Music"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MusicTag" ADD CONSTRAINT "MusicTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
