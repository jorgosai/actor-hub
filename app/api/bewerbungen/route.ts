import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const bewerbung = await prisma.application.create({
    data: {
      role: data.role,
      production: data.production,
      notes: data.notes,
    },
  });

  return NextResponse.json(bewerbung);
}