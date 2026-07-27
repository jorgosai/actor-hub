export const dynamic = "force-dynamic";

import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { KI_MODELL, antwortText, abgelehnt, ABLEHNUNG_TEXT } from "@/lib/ki";
import { kiAnfrageZaehlen, LimitErreicht } from "@/lib/ailimit";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getUserId();
  const { prompt } = await request.json();

  try {
    await kiAnfrageZaehlen(userId);
  } catch (e) {
    if (e instanceof LimitErreicht) {
      return NextResponse.json(
        { error: `Du hast dein Tageslimit für KI-Anfragen erreicht. Morgen geht es weiter.` },
        { status: 429 }
      );
    }
    throw e;
  }

  const rolle = await prisma.role.findFirst({ where: { id, userId } });
  if (!rolle) {
    return NextResponse.json({ error: "Rolle nicht gefunden" }, { status: 404 });
  }

  const kontext = `
Du bist ein erfahrener Acting Coach (Schauspielcoach) und hilfst bei der Rollenarbeit.
Du kennst Methoden wie Stanislawski, Meisner, Chubbuck und arbeitest praxisnah.

Aktuelle Rolle des Schauspielers:
- Rollenname: ${rolle.name}
${rolle.production ? `- Produktion: ${rolle.production}` : ""}
${rolle.biography ? `- Biografie der Figur: ${rolle.biography}` : ""}
${rolle.goals ? `- Ziele der Figur: ${rolle.goals}` : ""}
${rolle.obstacles ? `- Hindernisse: ${rolle.obstacles}` : ""}
${rolle.relationships ? `- Beziehungen: ${rolle.relationships}` : ""}
${rolle.subtext ? `- Subtext: ${rolle.subtext}` : ""}
${rolle.notes ? `- Notizen: ${rolle.notes}` : ""}

Antworte auf Deutsch, konkret und praxisnah. Stelle auch Rückfragen, die die Rollenarbeit vertiefen.
Du kannst nur beraten — Daten ändern kann nur der Schauspieler selbst in der App.
  `;

  const message = await anthropic.messages.create({
    model: KI_MODELL,
    max_tokens: 4096,
    output_config: { effort: "high" },
    system: kontext,
    messages: [{ role: "user", content: prompt }],
  });

  const antwort = abgelehnt(message) ? ABLEHNUNG_TEXT : antwortText(message);
  return NextResponse.json({ antwort });
}
