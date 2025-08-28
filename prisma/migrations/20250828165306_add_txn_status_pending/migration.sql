-- CreateEnum
CREATE TYPE "public"."TxnStatus" AS ENUM ('PENDING', 'POSTED');

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "availableAt" TIMESTAMP(3),
ADD COLUMN     "status" "public"."TxnStatus" NOT NULL DEFAULT 'POSTED';

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "public"."Transaction"("status");
