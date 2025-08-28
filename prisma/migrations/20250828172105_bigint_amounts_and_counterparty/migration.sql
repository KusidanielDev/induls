-- AlterTable
ALTER TABLE "public"."Account" ALTER COLUMN "balance" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "public"."ExternalTransfer" ALTER COLUMN "amountCents" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "counterpartyName" TEXT,
ALTER COLUMN "amountCents" SET DATA TYPE BIGINT;
