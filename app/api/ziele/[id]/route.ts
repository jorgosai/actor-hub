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

  if (data.art === "wish") {
    await prisma.wish.updateMany({
      where: { id, userId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.achieved !== undefined && { achieved: data.achieved }),
        ...(data.notes !== undefined && { notes: data.notes || null }),
      },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.goal.updateMany({
    where: { id, userId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.horizon !== undefined && { horizon: data.horizon }),
      ...(data.done !== undefined && { done: data.done }),
      ...(data.targetDate !== undefined && { targetDate: data.targetDate ? new Date(data.targetDate) : null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getUserId();
  const { searchParams } = new URL(request.url);
  if (searchParams.get("art") === "wish") {
    await prisma.wish.deleteMany({ where: { id, userId } });
  } else {
    await prisma.goal.deleteMany({ where: { id, userId } });
  }
  return NextResponse.json({ ok: true });
}
