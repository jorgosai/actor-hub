import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  const { prompt, typ } = await request.json();

  const [bewerbungen, kontakte] = await Promise.all([
    prisma.application.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.contact.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const kontext = `
Du bist ein persönlicher Karriere-Assistent für einen Schauspieler.

Aktuelle Bewerbungen:
${bewerbungen.map((b) => `- ${b.role} bei "${b.production}" (Status: ${b.status}${b.notes ? `, Notizen: ${b.notes}` : ""})`).join("\n")}

Kontakte:
${kontakte.map((k) => `- ${k.name} (${k.category}${k.company ? `, ${k.company}` : ""}${k.email ? `, ${k.email}` : ""})`).join("\n")}

Antworte auf Deutsch, präzise und hilfreich.
Wichtig: Du kannst nur lesen und analysieren, aber keine Daten erstellen, ändern oder löschen. Wenn jemand dich bittet etwas zu erstellen oder zu ändern, erkläre freundlich dass er das direkt in der App tun soll.
  `;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: kontext,
    messages: [{ role: "user", content: prompt }],
  });

  const antwort = message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ antwort });
}
