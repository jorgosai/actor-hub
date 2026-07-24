export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const userId = await getUserId();
  const data = await request.json();

  const rolle = await prisma.role.create({
    data: {
      userId,
      name: data.name,
      production: data.production || null,
      status: data.status ?? "In Arbeit",
    },
  });

  return NextResponse.json(rolle);
}
