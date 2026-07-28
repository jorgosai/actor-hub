import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import AufgabeForm from "./AufgabeForm";
import AufgabeItem from "./AufgabeItem";
import { SeitenKopf } from "@/components/seiten-kopf";
import { KARTE, ZEILEN } from "@/components/stil";

export default async function AufgabenPage() {
  const userId = await getUserId();
  const [aufgaben, castings, projekte] = await Promise.all([
    prisma.task.findMany({
      where: { userId },
      orderBy: [{ done: "asc" }, { dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
      include: { application: true, project: true },
    }),
    prisma.application.findMany({
      where: { userId, status: { notIn: ["Gebucht", "Abgesagt"] } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    prisma.project.findMany({
      where: { userId, status: "Laufend" },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
  ]);

  const offene = aufgaben.filter((a) => !a.done);
  const erledigte = aufgaben.filter((a) => a.done);

  function verknuepfung(a: (typeof aufgaben)[number]): string | null {
    if (a.application) return `${a.application.role} — ${a.application.production}`;
    if (a.project) return a.project.title;
    return null;
  }

  return (
    <>
      <SeitenKopf
        eyebrow="Übersicht"
        titel="Aufgaben"
        beschreibung={
          offene.length > 0
            ? `${offene.length} ${offene.length === 1 ? "Aufgabe ist" : "Aufgaben sind"} offen.`
            : "Nichts offen. Guter Moment für Rollenarbeit."
        }
      />

      <AufgabeForm
        castings={castings.map((c) => ({ id: c.id, label: `${c.role} — ${c.production}` }))}
        projekte={projekte.map((p) => ({ id: p.id, label: p.title }))}
      />

      {offene.length === 0 ? (
        <p className="text-sm text-muted-foreground">Keine offenen Aufgaben.</p>
      ) : (
        <div className={`${KARTE} ${ZEILEN} py-1`}>
          {offene.map((a) => (
            <AufgabeItem
              key={a.id}
              id={a.id}
              title={a.title}
              done={a.done}
              dueDate={a.dueDate}
              priority={a.priority}
              verknuepfung={verknuepfung(a)}
            />
          ))}
        </div>
      )}

      {erledigte.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Erledigt ({erledigte.length})
          </p>
          <div className={`${KARTE} ${ZEILEN} py-1 opacity-65`}>
            {erledigte.map((a) => (
              <AufgabeItem
                key={a.id}
                id={a.id}
                title={a.title}
                done={a.done}
                dueDate={a.dueDate}
                priority={a.priority}
                verknuepfung={verknuepfung(a)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
