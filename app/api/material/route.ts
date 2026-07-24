export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  // Wenn neues Material als "aktuell" markiert wird, alte Versionen desselben Typs auf nicht-aktuell setzen
  if (data.current) {
    await prisma.material.updateMany({
      where: { type: data.type, current: true },
      data: { current: false },
    });
  }

  const material = await prisma.material.create({
    data: {
      name: data.name,
      type: data.type ?? "Sonstiges",
      url: data.url || null,
      version: data.version || null,
      current: data.current ?? true,
      notes: data.notes || null,
    },
  });

  return NextResponse.json(material);
}
