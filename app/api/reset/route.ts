export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { token, password } = await request.json();

  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Das Passwort muss mindestens 8 Zeichen haben." },
      { status: 400 }
    );
  }

  const eintrag = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!eintrag || eintrag.usedAt || eintrag.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Dieser Link ist abgelaufen oder wurde schon benutzt." },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: eintrag.userId },
    data: { password: await bcrypt.hash(password, 10) },
  });
  await prisma.passwordResetToken.update({
    where: { id: eintrag.id },
    data: { usedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
