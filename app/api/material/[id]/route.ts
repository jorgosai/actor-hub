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

  // Als aktuelle Version markieren: andere desselben Typs zurücksetzen
  if (data.current === true) {
    const existing = await prisma.material.findFirst({ where: { id, userId } });
    if (existing) {
      await prisma.material.updateMany({
        where: { userId, type: existing.type, current: true, id: { not: id } },
        data: { current: false },
      });
    }
  }

  await prisma.material.updateMany({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.url !== undefined && { url: data.url || null }),
      ...(data.version !== undefined && { version: data.version || null }),
      ...(data.current !== undefined && { current: data.current }),
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
  await prisma.material.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}
