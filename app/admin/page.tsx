import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { istAdmin } from "@/lib/admin";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const userId = await getUserId();

  if (!(await istAdmin(userId))) {
    return (
      <div>
        <h1 className="mb-2 text-foreground font-serif text-[calc(2.25rem*var(--serif-skala))] leading-[1.1] sm:text-[calc(3rem*var(--serif-skala))]">Verwaltung</h1>
        <p className="text-muted-foreground text-sm">Diese Seite ist nur für den Betreiber sichtbar.</p>
      </div>
    );
  }

  const heute = new Date().toISOString().slice(0, 10);
  const [nutzer, nutzung] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.aiUsage.findMany({ where: { day: heute } }),
  ]);

  const liste = nutzer.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    seit: u.createdAt.toLocaleDateString("de-DE"),
    kiHeute: nutzung.find((n) => n.userId === u.id)?.count ?? 0,
  }));

  const kiGesamtHeute = nutzung.reduce((s, n) => s + n.count, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-foreground font-serif text-[calc(2.25rem*var(--serif-skala))] leading-[1.1] sm:text-[calc(3rem*var(--serif-skala))]">Verwaltung</h1>
        <p className="text-sm text-muted-foreground">
          {liste.length} Nutzer · {kiGesamtHeute} KI-Anfragen heute
        </p>
      </div>
      <AdminClient nutzer={liste} />
    </div>
  );
}
