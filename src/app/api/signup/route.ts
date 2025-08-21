import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function rand(n = 12) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔒 Normalize inputs
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const name = (body.name?.toString().trim() || null) as string | null;
    const password = String(body.password || "");
    const accountType = (body.accountType || "SAVINGS") as
      | "CHECKING"
      | "SAVINGS";
    const accountNumber = body.accountNumber?.toString().trim() || undefined;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // 🚫 Duplicate email check (case-insensitive)
    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email, // ✅ normalized
        name,
        password: hashed, // ✅ bcrypt hash
        // status defaults to PENDING in your Prisma schema
        accounts: {
          create: [
            {
              type: accountType,
              number: accountNumber || rand(12),
              balance: 0,
              currency: "INR",
            },
          ],
        },
      },
      include: { accounts: true },
    });

    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Signup failed" },
      { status: 500 }
    );
  }
}
