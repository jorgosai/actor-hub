export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();

  const aufgabe = await prisma.task.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.done !== undefined && { done: data.done }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
      ...(data.applicationId !== undefined && { applicationId: data.applicationId || null }),
      ...(data.projectId !== undefined && { projectId: data.projectId || null }),
    },
  });

  return NextResponse.json(aufgabe);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
