export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();

  if (data.art === "wish") {
    const wish = await prisma.wish.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.achieved !== undefined && { achieved: data.achieved }),
        ...(data.notes !== undefined && { notes: data.notes || null }),
      },
    });
    return NextResponse.json(wish);
  }

  const goal = await prisma.goal.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.horizon !== undefined && { horizon: data.horizon }),
      ...(data.done !== undefined && { done: data.done }),
      ...(data.targetDate !== undefined && { targetDate: data.targetDate ? new Date(data.targetDate) : null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });
  return NextResponse.json(goal);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  if (searchParams.get("art") === "wish") {
    await prisma.wish.delete({ where: { id } });
  } else {
    await prisma.goal.delete({ where: { id } });
  }
  return NextResponse.json({ ok: true });
}
