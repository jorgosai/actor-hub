import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const projekt = await prisma.project.create({
    data: {
      title: data.title,
      role: data.role,
      status: data.status,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      notes: data.notes,
    },
  });

  return NextResponse.json(projekt);
}
