-- CreateTable
CREATE TABLE "public"."ExternalTransfer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amountCents" INTEGER NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ExternalTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExternalTransfer_accountId_idx" ON "public"."ExternalTransfer"("accountId");

-- CreateIndex
CREATE INDEX "ExternalTransfer_userId_idx" ON "public"."ExternalTransfer"("userId");

-- CreateIndex
CREATE INDEX "ExternalTransfer_accountNumber_idx" ON "public"."ExternalTransfer"("accountNumber");

-- CreateIndex
CREATE INDEX "ExternalTransfer_ifscCode_idx" ON "public"."ExternalTransfer"("ifscCode");

-- AddForeignKey
ALTER TABLE "public"."ExternalTransfer" ADD CONSTRAINT "ExternalTransfer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExternalTransfer" ADD CONSTRAINT "ExternalTransfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
