export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const userId = await getUserId();
  const data = await request.json();

  // Sicherstellen, dass die Rolle dem Nutzer gehört
  const rolle = await prisma.role.findFirst({ where: { id: data.roleId, userId } });
  if (!rolle) return NextResponse.json({ error: "Rolle nicht gefunden" }, { status: 404 });

  const szene = await prisma.scene.create({
    data: {
      userId,
      roleId: data.roleId,
      title: data.title,
      text: data.text || null,
      notes: data.notes || null,
    },
  });

  return NextResponse.json(szene);
}
