// scripts/list-accounts.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.account.findMany({
    select: { id: true, userId: true, balance: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  console.table(rows);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
