// scripts/check-account.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error("Usage: npx tsx scripts/check-account.ts <ACCOUNT_ID>");
    process.exit(1);
  }

  const [account, transactions, externalTransfers] = await Promise.all([
    prisma.account.count({ where: { id } }),
    prisma.transaction.count({ where: { accountId: id } }),
    prisma.externalTransfer.count({ where: { accountId: id } }),
  ]);

  console.log({ account, transactions, externalTransfers });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
