/*
  Warnings:

  - You are about to drop the column `name` on the `verification_tokens` table. All the data will be lost.
  - A unique constraint covering the columns `[email,token]` on the table `verification_tokens` will be removed. If there are not-null values in those columns, a new unique constraint will be created.

*/
-- DropIndex
DROP INDEX IF EXISTS "verification_tokens_email_token_key";

-- AlterTable
ALTER TABLE "verification_tokens" ADD COLUMN "userId" TEXT,
ADD COLUMN "usedAt" TIMESTAMP(3),
ADD COLUMN "sentAt" TIMESTAMP(3),
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "verification_tokens_email_idx" ON "verification_tokens"("email");

-- CreateIndex
CREATE INDEX "verification_tokens_expires_idx" ON "verification_tokens"("expires");

-- CreateIndex
CREATE INDEX "verification_tokens_userId_idx" ON "verification_tokens"("userId");

-- AddForeignKey
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
