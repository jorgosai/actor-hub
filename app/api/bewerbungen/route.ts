export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const userId = await getUserId();
  const data = await request.json();

  const bewerbung = await prisma.application.create({
    data: {
      userId,
      role: data.role,
      production: data.production,
      notes: data.notes,
      contactId: data.contactId ?? null,
      status: data.status ?? "Beworben",
      followUpAt: data.followUpAt ? new Date(data.followUpAt) : null,
      deadline: data.deadline ? new Date(data.deadline) : null,
    },
  });

  return NextResponse.json(bewerbung);
}