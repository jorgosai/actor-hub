import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import TerminForm from "./TerminForm";
import TerminItem from "./TerminItem";
import { SeitenKopf } from "@/components/seiten-kopf";
import { KARTE, ZEILEN } from "@/components/stil";

export default async function KalenderPage() {
  const userId = await getUserId();
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);

  const [termine, vergangene, castings, projekte] = await Promise.all([
    prisma.event.findMany({
      where: { userId, date: { gte: heute } },
      orderBy: { date: "asc" },
      include: { application: true, project: true },
    }),
    prisma.event.findMany({
      where: { userId, date: { lt: heute } },
      orderBy: { date: "desc" },
      take: 5,
      include: { application: true, project: true },
    }),
    prisma.application.findMany({
      where: { userId, status: { notIn: ["Gebucht", "Abgesagt"] } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    prisma.project.findMany({
      where: { userId, status: { not: "Abgeschlossen" } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
  ]);

  type Termin = (typeof termine)[number];

  function verknuepfung(t: Termin): string | null {
    if (t.application) return `${t.application.role} — ${t.application.production}`;
    if (t.project) return t.project.title;
    return null;
  }

  // Nach Tag gruppieren
  const gruppen = new Map<string, Termin[]>();
  for (const t of termine) {
    const key = new Date(t.date).toDateString();
    if (!gruppen.has(key)) gruppen.set(key, []);
    gruppen.get(key)!.push(t);
  }

  function tagLabel(key: string): string {
    const d = new Date(key);
    const diff = Math.round((d.getTime() - heute.getTime()) / 86400000);
    const datum = d.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
    if (diff === 0) return `Heute — ${datum}`;
    if (diff === 1) return `Morgen — ${datum}`;
    return datum;
  }

  return (
    <>
      <SeitenKopf
        eyebrow="Übersicht"
        titel="Kalender"
        beschreibung={
          termine.length > 0
            ? `${termine.length} ${termine.length === 1 ? "anstehender Termin" : "anstehende Termine"} — Castings, Drehs, Proben.`
            : "Keine anstehenden Termine. Trag deinen nächsten ein."
        }
      />

      <TerminForm
        castings={castings.map((c) => ({ id: c.id, label: `${c.role} — ${c.production}` }))}
        projekte={projekte.map((p) => ({ id: p.id, label: p.title }))}
      />

      <div className="space-y-8">
        {termine.length === 0 ? (
          <p className="text-sm text-muted-foreground">Keine anstehenden Termine.</p>
        ) : (
          [...gruppen.entries()].map(([key, liste]) => (
            <div key={key}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {tagLabel(key)}
              </p>
              <div className={`${KARTE} ${ZEILEN} py-1`}>
                {liste.map((t) => (
                  <TerminItem
                    key={t.id}
                    id={t.id}
                    title={t.title}
                    type={t.type}
                    date={t.date}
                    location={t.location}
                    notes={t.notes}
                    verknuepfung={verknuepfung(t)}
                  />
                ))}
              </div>
            </div>
          ))
        )}

        {vergangene.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
              Vergangene Termine
            </p>
            <div className={`${KARTE} ${ZEILEN} py-1 opacity-60`}>
              {vergangene.map((t) => (
                <TerminItem
                  key={t.id}
                  id={t.id}
                  title={t.title}
                  type={t.type}
                  date={t.date}
                  location={t.location}
                  notes={t.notes}
                  verknuepfung={verknuepfung(t)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
