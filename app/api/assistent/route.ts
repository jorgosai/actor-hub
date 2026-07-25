export const dynamic = "force-dynamic";

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  const userId = await getUserId();
  const { prompt, typ } = await request.json();

  const [bewerbungen, kontakte, aufgaben, termine, ziele, wuensche, journal] = await Promise.all([
    prisma.application.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.contact.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.task.findMany({ where: { userId, done: false }, orderBy: { dueDate: { sort: "asc", nulls: "last" } }, take: 20 }),
    prisma.event.findMany({ where: { userId, date: { gte: new Date() } }, orderBy: { date: "asc" }, take: 10 }),
    prisma.goal.findMany({ where: { userId, done: false }, take: 10 }),
    prisma.wish.findMany({ where: { userId, achieved: false }, take: 15 }),
    prisma.journalEntry.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  const kontext = `
Du bist ein persönlicher Karriere-Assistent für einen Schauspieler.

Aktuelle Bewerbungen:
${bewerbungen.map((b) => `- ${b.role} bei "${b.production}" (Status: ${b.status}${b.notes ? `, Notizen: ${b.notes}` : ""})`).join("\n")}

Kontakte:
${kontakte.map((k) => `- ${k.name} (${k.category}${k.company ? `, ${k.company}` : ""}${k.email ? `, ${k.email}` : ""})`).join("\n")}

Anstehende Termine:
${termine.map((t) => `- ${new Date(t.date).toLocaleDateString("de-DE")} ${t.title} (${t.type}${t.location ? `, ${t.location}` : ""})`).join("\n")}

Offene Aufgaben:
${aufgaben.map((a) => `- ${a.title}${a.dueDate ? ` (fällig: ${new Date(a.dueDate).toLocaleDateString("de-DE")})` : ""}${a.priority !== "Normal" ? ` [${a.priority}]` : ""}`).join("\n")}

Karriereziele:
${ziele.map((z) => `- ${z.title} (${z.horizon})`).join("\n")}

Wunschliste:
${wuensche.map((w) => `- ${w.title} (${w.type})`).join("\n")}

Letzte Journal-Einträge (Reflexionen):
${journal.map((j) => `- ${new Date(j.createdAt).toLocaleDateString("de-DE")} ${j.title}${j.learned ? ` | Gelernt: ${j.learned}` : ""}${j.wentWell ? ` | Lief gut: ${j.wentWell}` : ""}`).join("\n")}

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
