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
    data: { status: data.status },
  });

  return NextResponse.json(bewerbung);
}