-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "topicKey" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Generation_subject_difficulty_idx" ON "Generation"("subject", "difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "Generation_subject_difficulty_topicKey_key" ON "Generation"("subject", "difficulty", "topicKey");
