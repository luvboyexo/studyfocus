-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Fácil', 'Médio', 'Difícil', 'Profissional');

-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Generation_topic_difficulty_idx" ON "Generation"("topic", "difficulty");
