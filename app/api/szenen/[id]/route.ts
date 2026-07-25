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

  await prisma.scene.updateMany({
    where: { id, userId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.text !== undefined && { text: data.text || null }),
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
  await prisma.scene.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}
