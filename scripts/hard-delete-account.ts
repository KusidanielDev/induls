// scripts/hard-delete-account.ts
/* eslint-disable no-console */
import { prisma } from "@/lib/prisma";

/**
 * Usage:
 *  pnpm ts-node scripts/hard-delete-account.ts --id <accountId>
 *  pnpm ts-node scripts/hard-delete-account.ts --number <accountNumber>
 *  pnpm ts-node scripts/hard-delete-account.ts --id <accountId> --force
 */

function getArg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  if (i >= 0 && i + 1 < process.argv.length) return process.argv[i + 1];
  return undefined;
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function formatINRfromCentsBig(cents: bigint): string {
  // cents -> rupees as string
  const rupees = Number(cents) / 100;
  return `₹ ${rupees.toLocaleString("en-IN")}`;
}

async function main() {
  const id = getArg("--id");
  const number = getArg("--number");
  const force = hasFlag("--force");

  if (!id && !number) {
    console.error(
      "Error: provide either --id <accountId> or --number <accountNumber> (optionally --force)."
    );
    process.exit(1);
  }
  if (id && number) {
    console.error("Error: pass only one of --id or --number, not both.");
    process.exit(1);
  }

  const acct = await prisma.account.findFirst({
    where: id ? { id } : { number: String(number) },
    select: {
      id: true,
      number: true,
      userId: true,
      balance: true, // BigInt
      currency: true,
      createdAt: true,
      _count: {
        select: { txns: true, externalTransfers: true },
      },
    },
  });

  if (!acct) {
    console.error("Account not found.");
    process.exit(1);
  }

  console.log(
    [
      `About to delete account:`,
      `  id:       ${acct.id}`,
      `  number:   ${acct.number}`,
      `  userId:   ${acct.userId}`,
      `  balance:  ${acct.balance} (${formatINRfromCentsBig(acct.balance)})`,
      `  currency: ${acct.currency}`,
      `  created:  ${acct.createdAt.toISOString()}`,
      `  txns:     ${acct._count.txns}`,
      `  external: ${acct._count.externalTransfers}`,
      `  force:    ${force ? "yes" : "no"}`,
    ].join("\n")
  );

  // ✅ BigInt-safe comparison
  if (!force && acct.balance !== 0n) {
    throw new Error(
      `Refusing: balance must be 0n (current ${acct.balance}). Use --force to override.`
    );
  }

  // With Prisma relations set to onDelete: Cascade, this will remove child rows.
  await prisma.account.delete({ where: { id: acct.id } });

  console.log("✅ Account hard-deleted successfully.");
}

main()
  .catch((err) => {
    console.error("❌ Failed:", err?.message ?? err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
