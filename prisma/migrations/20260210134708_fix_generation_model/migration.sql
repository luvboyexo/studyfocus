/*
  Warnings:

  - You are about to drop the column `topic` on the `Generation` table. All the data in the column will be lost.
  - Added the required column `subject` to the `Generation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `difficulty` on the `Generation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `content` on the `Generation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Generation_topic_difficulty_idx";

-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "topic",
ADD COLUMN     "subject" TEXT NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" TEXT NOT NULL,
DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;

-- DropEnum
DROP TYPE "Difficulty";

-- CreateIndex
CREATE INDEX "Generation_subject_difficulty_idx" ON "Generation"("subject", "difficulty");
