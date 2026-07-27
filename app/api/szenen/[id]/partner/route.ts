export const dynamic = "force-dynamic";

import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { kiAnfrageZaehlen, LimitErreicht } from "@/lib/ailimit";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getUserId();

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
  const { messages, modus } = (await request.json()) as {
    messages: ChatMessage[];
    modus: "partner" | "abfrage";
  };

  const szene = await prisma.scene.findFirst({
    where: { id, userId },
    include: { role: true },
  });
  if (!szene) return NextResponse.json({ error: "Szene nicht gefunden" }, { status: 404 });

  const basis = `
Rolle des Schauspielers: ${szene.role.name}${szene.role.production ? ` (${szene.role.production})` : ""}
Szene: ${szene.title}
${szene.text ? `Szenentext:\n${szene.text}` : "Es wurde noch kein Szenentext hinterlegt."}
${szene.notes ? `Notizen des Schauspielers: ${szene.notes}` : ""}
  `;

  const system =
    modus === "abfrage"
      ? `Du hilfst einem Schauspieler, seinen Text zu lernen (Textabfrage).
${basis}
Regeln:
- Gib dem Schauspieler jeweils das Stichwort (die Zeile VOR seinem Einsatz) und warte auf seine Zeile.
- Vergleiche seine Antwort mit dem Text. Bei Fehlern: korrigiere kurz und präzise, dann weiter.
- Sei geduldig und ermutigend. Antworte auf Deutsch, kurz und fokussiert.`
      : `Du bist ein KI-Szenenpartner für Schauspielproben.
${basis}
Regeln:
- Spiele die anderen Figuren der Szene, der Schauspieler spielt ${szene.role.name}.
- Bleibe in der Szene und im Ton des Textes. Improvisiere passend, wenn der Text abweicht.
- Wenn der Schauspieler mit "REGIE:" schreibt, verlasse kurz die Szene und antworte als Coach.
- Antworte auf Deutsch (außer der Szenentext ist in einer anderen Sprache).`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system,
    messages: messages.slice(-20),
  });

  const antwort = message.content[0].type === "text" ? message.content[0].text : "";
  return NextResponse.json({ antwort });
}
