// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
});

function randomAcct(): string {
  const n = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return n.startsWith("0") ? "1" + n.slice(1) : n;
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, name, password } = schema.parse(json);

    const lower = email.toLowerCase().trim();
    const exists = await prisma.user.findUnique({ where: { email: lower } });
    if (exists)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );

    const hash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: lower,
        name,
        password: hash,
        accounts: {
          create: [
            {
              type: "CHECKING",
              number: randomAcct(),
              balance: 0,
              currency: "INR",
            },
            {
              type: "SAVINGS",
              number: randomAcct(),
              balance: 0,
              currency: "INR",
            },
          ],
        },
      },
      include: { accounts: true },
    });

    return NextResponse.json({ ok: true, user: { id: user.id } });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Signup failed" },
      { status: 400 }
    );
  }
}
