/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `Presentation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Presentation" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Presentation_shareToken_key" ON "Presentation"("shareToken");
