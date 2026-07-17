export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();

  const bewerbung = await prisma.application.update({
    where: { id },
    data: {
      ...(data.status && { status: data.status }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.production !== undefined && { production: data.production }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
      ...(data.contactId !== undefined && { contactId: data.contactId || null }),
    },
  });

  return NextResponse.json(bewerbung);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.application.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}