export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { istAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  const adminId = await getUserId();
  if (!(await istAdmin(adminId))) {
    return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403 });
  }

  const { userId } = await request.json();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Nutzer nicht gefunden." }, { status: 404 });

  const token = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 Stunden gültig
    },
  });

  const origin = new URL(request.url).origin;
  return NextResponse.json({ url: `${origin}/reset/${token}` });
}
