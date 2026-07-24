import { prisma } from "@/lib/db";
import TerminForm from "./TerminForm";
import TerminItem from "./TerminItem";

export default async function KalenderPage() {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);

  const [termine, vergangene, castings, projekte] = await Promise.all([
    prisma.event.findMany({
      where: { date: { gte: heute } },
      orderBy: { date: "asc" },
      include: { application: true, project: true },
    }),
    prisma.event.findMany({
      where: { date: { lt: heute } },
      orderBy: { date: "desc" },
      take: 5,
      include: { application: true, project: true },
    }),
    prisma.application.findMany({
      where: { status: { notIn: ["Gebucht", "Abgesagt"] } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      where: { status: { not: "Abgeschlossen" } },
      orderBy: { createdAt: "desc" },
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Kalender</h1>
        <p className="text-sm text-neutral-500">{termine.length} anstehende Termine</p>
      </div>

      <TerminForm
        castings={castings.map((c) => ({ id: c.id, label: `${c.role} — ${c.production}` }))}
        projekte={projekte.map((p) => ({ id: p.id, label: p.title }))}
      />

      <div className="mt-8 space-y-8">
        {termine.length === 0 ? (
          <p className="text-neutral-500">Keine anstehenden Termine.</p>
        ) : (
          [...gruppen.entries()].map(([key, liste]) => (
            <div key={key}>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">
                {tagLabel(key)}
              </p>
              <div className="space-y-2">
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
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-300 mb-3">
              Vergangene Termine
            </p>
            <div className="space-y-2 opacity-60">
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
    </div>
  );
}
