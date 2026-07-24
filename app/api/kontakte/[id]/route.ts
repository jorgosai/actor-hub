export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();

  // Schnellaktion: nur lastContact aktualisieren
  if (data.touchLastContact) {
    const kontakt = await prisma.contact.update({
      where: { id },
      data: { lastContact: new Date() },
    });
    return NextResponse.json(kontakt);
  }

  const kontakt = await prisma.contact.update({
    where: { id },
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
  return NextResponse.json(kontakt);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
