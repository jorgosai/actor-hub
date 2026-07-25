export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const userId = await getUserId();
  const data = await request.json();

  const eintrag = await prisma.journalEntry.create({
    data: {
      userId,
      title: data.title,
      wentWell: data.wentWell || null,
      learned: data.learned || null,
      emotions: data.emotions || null,
      notes: data.notes || null,
    },
  });

  return NextResponse.json(eintrag);
}
