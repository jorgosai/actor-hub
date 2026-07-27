import { prisma } from "@/lib/db";

/**
 * Admin ist entweder der Nutzer mit der in ADMIN_EMAIL hinterlegten Adresse
 * oder – falls nicht gesetzt – der zuerst registrierte Nutzer.
 */
export async function istAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  if (adminEmail) return user.email === adminEmail;

  const ersterNutzer = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  return ersterNutzer?.id === userId;
}
