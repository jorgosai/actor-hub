export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const userId = await getUserId();
  const data = await request.json();

  const termin = await prisma.event.create({
    data: {
      userId,
      title: data.title,
      type: data.type ?? "Sonstiges",
      date: new Date(data.date),
      endDate: data.endDate ? new Date(data.endDate) : null,
      location: data.location || null,
      notes: data.notes || null,
      applicationId: data.applicationId || null,
      projectId: data.projectId || null,
    },
  });

  return NextResponse.json(termin);
}
