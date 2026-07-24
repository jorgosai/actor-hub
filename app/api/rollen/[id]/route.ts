export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getUserId();
  const data = await request.json();

  await prisma.role.updateMany({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.production !== undefined && { production: data.production || null }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.biography !== undefined && { biography: data.biography || null }),
      ...(data.goals !== undefined && { goals: data.goals || null }),
      ...(data.obstacles !== undefined && { obstacles: data.obstacles || null }),
      ...(data.relationships !== undefined && { relationships: data.relationships || null }),
      ...(data.subtext !== undefined && { subtext: data.subtext || null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getUserId();
  await prisma.role.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}
