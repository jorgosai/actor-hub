export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const userId = await getUserId();
  const data = await request.json();

  const aufgabe = await prisma.task.create({
    data: {
      userId,
      title: data.title,
      priority: data.priority ?? "Normal",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      applicationId: data.applicationId || null,
      projectId: data.projectId || null,
    },
  });

  return NextResponse.json(aufgabe);
}
