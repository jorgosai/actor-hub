export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  if (data.art === "wish") {
    const wish = await prisma.wish.create({
      data: {
        title: data.title,
        type: data.type ?? "Rolle",
        notes: data.notes || null,
      },
    });
    return NextResponse.json(wish);
  }

  const goal = await prisma.goal.create({
    data: {
      title: data.title,
      horizon: data.horizon ?? "Mittelfristig",
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
      notes: data.notes || null,
    },
  });
  return NextResponse.json(goal);
}
