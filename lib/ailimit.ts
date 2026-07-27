import { prisma } from "@/lib/db";

// Wie viele KI-Anfragen darf ein Nutzer pro Tag stellen?
const TAGESLIMIT = Number(process.env.AI_DAILY_LIMIT ?? 30);

export class LimitErreicht extends Error {
  constructor(public limit: number) {
    super(`Tageslimit von ${limit} KI-Anfragen erreicht.`);
  }
}

/**
 * Zählt eine KI-Anfrage für heute. Wirft LimitErreicht, wenn das
 * Tageslimit bereits ausgeschöpft ist.
 */
export async function kiAnfrageZaehlen(userId: string): Promise<void> {
  const day = new Date().toISOString().slice(0, 10);

  const usage = await prisma.aiUsage.upsert({
    where: { userId_day: { userId, day } },
    create: { userId, day, count: 1 },
    update: { count: { increment: 1 } },
  });

  if (usage.count > TAGESLIMIT) {
    throw new LimitErreicht(TAGESLIMIT);
  }
}
