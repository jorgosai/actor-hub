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

  // Schnellaktion: nur lastContact aktualisieren
  if (data.touchLastContact) {
    await prisma.contact.updateMany({
      where: { id, userId },
      data: { lastContact: new Date() },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.contact.updateMany({
    where: { id, userId },
    data: {
      name: data.name,
      category: data.category,
      email: data.email || null,
      phone: data.phone || null,
      company: data.company || null,
      notes: data.notes || null,
      ...(data.lastContact !== undefined && {
        lastContact: data.lastContact ? new Date(data.lastContact) : null,
      }),
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
  await prisma.contact.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}
