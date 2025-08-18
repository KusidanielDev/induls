// src/app/api/transfer/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { userId } = await requireUser();
    const body = await req.json();

    console.log("Transfer request body:", body); // Debugging log

    // Validate common parameters
    const fromId = String(body?.fromId || "");
    const amount = Number(body?.amount || 0); // paise
    const description = String(body?.description || "Transfer");

    if (!fromId || amount <= 0) {
      console.error("Invalid input - missing fromId or invalid amount");
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Handle internal transfer
    if (body.toId) {
      const toId = String(body.toId);

      if (fromId === toId) {
        console.error("Cannot transfer to same account");
        return NextResponse.json(
          { error: "Cannot transfer to same account" },
          { status: 400 }
        );
      }

      const [from, to] = await Promise.all([
        prisma.account.findFirst({ where: { id: fromId, userId } }),
        prisma.account.findFirst({ where: { id: toId, userId } }),
      ]);

      if (!from || !to) {
        console.error("Account not found");
        return NextResponse.json(
          { error: "Account not found" },
          { status: 404 }
        );
      }

      if (from.balance < amount) {
        console.error("Insufficient funds");
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        );
      }

      await prisma.$transaction(async (tx) => {
        await tx.account.update({
          where: { id: fromId },
          data: { balance: { decrement: amount } },
        });
        await tx.account.update({
          where: { id: toId },
          data: { balance: { increment: amount } },
        });
        await tx.transaction.create({
          data: {
            type: "DEBIT",
            amountCents: amount,
            description,
            accountId: fromId,
            userId,
          },
        });
        await tx.transaction.create({
          data: {
            type: "CREDIT",
            amountCents: amount,
            description,
            accountId: toId,
            userId,
          },
        });
      });

      return NextResponse.json({ ok: true });
    }
    // Handle external transfer
    else if (body.externalAccount) {
      const externalAccount = body.externalAccount;
      const accountNumber = String(externalAccount.accountNumber || "");
      const ifscCode = String(externalAccount.ifscCode || "");
      const name = String(externalAccount.name || "");

      // Validate external account details
      if (!accountNumber || !ifscCode || !name) {
        console.error("Missing external account details");
        return NextResponse.json(
          { error: "Missing external account details" },
          { status: 400 }
        );
      }

      if (accountNumber.length < 10 || ifscCode.length < 8) {
        console.error("Invalid account number or IFSC code");
        return NextResponse.json(
          { error: "Invalid account number or IFSC code" },
          { status: 400 }
        );
      }

      const from = await prisma.account.findFirst({
        where: { id: fromId, userId },
      });

      if (!from) {
        console.error("Sender account not found");
        return NextResponse.json(
          { error: "Account not found" },
          { status: 404 }
        );
      }

      if (from.balance < amount) {
        console.error("Insufficient funds for external transfer");
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        );
      }

      await prisma.$transaction(async (tx) => {
        // Deduct from sender's account
        await tx.account.update({
          where: { id: fromId },
          data: { balance: { decrement: amount } },
        });

        // Create debit transaction
        await tx.transaction.create({
          data: {
            type: "DEBIT",
            amountCents: amount,
            description: `${description} • To: ${name} (${accountNumber})`,
            accountId: fromId,
            userId,
          },
        });

        // Create external transfer record
        await tx.externalTransfer.create({
          data: {
            amountCents: amount,
            accountNumber,
            ifscCode,
            recipientName: name,
            userId,
            accountId: fromId,
          },
        });
      });

      return NextResponse.json({ ok: true });
    } else {
      console.error("Invalid transfer type");
      return NextResponse.json(
        { error: "Invalid transfer type" },
        { status: 400 }
      );
    }
  } catch (e: any) {
    console.error("Transfer error:", e);
    return NextResponse.json(
      { error: e?.message || "Transfer failed" },
      { status: 500 }
    );
  }
}
