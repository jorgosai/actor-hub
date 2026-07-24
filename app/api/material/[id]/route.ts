export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();

  // Als aktuelle Version markieren: andere desselben Typs zurücksetzen
  if (data.current === true) {
    const existing = await prisma.material.findUnique({ where: { id } });
    if (existing) {
      await prisma.material.updateMany({
        where: { type: existing.type, current: true, id: { not: id } },
        data: { current: false },
      });
    }
  }

  const material = await prisma.material.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.url !== undefined && { url: data.url || null }),
      ...(data.version !== undefined && { version: data.version || null }),
      ...(data.current !== undefined && { current: data.current }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });

  return NextResponse.json(material);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.material.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
