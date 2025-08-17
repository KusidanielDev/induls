import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma"; // adjust if your prisma.ts path differs

function rand(n = 12) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
}

export async function POST(req: Request) {
  try {
    const {
      email,
      name,
      password,
      accountType = "SAVINGS",
      accountNumber,
    } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        accounts: {
          create: [
            {
              type: accountType,
              number: accountNumber || rand(12),
              balance: 150000, // ₹1,500.00 (stored as paise/cent in your schema)
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
