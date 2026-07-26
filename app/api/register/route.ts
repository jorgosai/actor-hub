export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const data = await request.json();
  const name = (data.name as string | undefined)?.trim();
  const email = (data.email as string | undefined)?.toLowerCase().trim();
  const password = data.password as string | undefined;
  const inviteCode = (data.inviteCode as string | undefined)?.trim();

  const erwarteterCode = process.env.INVITE_CODE;
  if (erwarteterCode && inviteCode !== erwarteterCode) {
    return NextResponse.json({ error: "Ungültiger Einladungscode." }, { status: 403 });
  }

  if (!name || !email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Bitte Name, E-Mail und ein Passwort mit mindestens 8 Zeichen angeben." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Diese E-Mail ist bereits registriert." }, { status: 400 });
  }

  const isFirstUser = (await prisma.user.count()) === 0;

  const user = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 10) },
  });

  // Der erste registrierte Nutzer übernimmt alle bestehenden Daten (Migration)
  if (isFirstUser) {
    const claim = { where: { userId: null }, data: { userId: user.id } };
    await Promise.all([
      prisma.contact.updateMany(claim),
      prisma.application.updateMany(claim),
      prisma.project.updateMany(claim),
      prisma.task.updateMany(claim),
      prisma.event.updateMany(claim),
      prisma.material.updateMany(claim),
      prisma.goal.updateMany(claim),
      prisma.wish.updateMany(claim),
    ]);
  }

  return NextResponse.json({ ok: true });
}
