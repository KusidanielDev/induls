-- DropForeignKey
ALTER TABLE "public"."ExternalTransfer" DROP CONSTRAINT "ExternalTransfer_accountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExternalTransfer" DROP CONSTRAINT "ExternalTransfer_userId_fkey";

-- CreateIndex
CREATE INDEX "Account_userId_createdAt_idx" ON "public"."Account"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."ExternalTransfer" ADD CONSTRAINT "ExternalTransfer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExternalTransfer" ADD CONSTRAINT "ExternalTransfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
