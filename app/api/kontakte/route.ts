export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const kontakt = await prisma.contact.create({
    data: {
      name: data.name,
      category: data.category,
      email: data.email,
      phone: data.phone,
      company: data.company,
      notes: data.notes,
    },
  });

  return NextResponse.json(kontakt);
}
