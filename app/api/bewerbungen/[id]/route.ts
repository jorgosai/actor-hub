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

  await prisma.application.updateMany({
    where: { id, userId },
    data: {
      ...(data.status && { status: data.status }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.production !== undefined && { production: data.production }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
      ...(data.contactId !== undefined && { contactId: data.contactId || null }),
      ...(data.followUpAt !== undefined && { followUpAt: data.followUpAt ? new Date(data.followUpAt) : null }),
      ...(data.deadline !== undefined && { deadline: data.deadline ? new Date(data.deadline) : null }),
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
  await prisma.application.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}