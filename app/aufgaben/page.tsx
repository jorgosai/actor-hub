import { prisma } from "@/lib/db";
import AufgabeForm from "./AufgabeForm";
import AufgabeItem from "./AufgabeItem";

export default async function AufgabenPage() {
  const [aufgaben, castings, projekte] = await Promise.all([
    prisma.task.findMany({
      orderBy: [{ done: "asc" }, { dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
      include: { application: true, project: true },
    }),
    prisma.application.findMany({
      where: { status: { notIn: ["Gebucht", "Abgesagt"] } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      where: { status: "Laufend" },
      orderBy: { createdAt: "desc" },
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Aufgaben</h1>
        <p className="text-sm text-neutral-500">{offene.length} offen</p>
      </div>

      <AufgabeForm
        castings={castings.map((c) => ({ id: c.id, label: `${c.role} — ${c.production}` }))}
        projekte={projekte.map((p) => ({ id: p.id, label: p.title }))}
      />

      <div className="mt-8 space-y-2">
        {offene.length === 0 ? (
          <p className="text-neutral-500">Keine offenen Aufgaben. 🎉</p>
        ) : (
          offene.map((a) => (
            <AufgabeItem
              key={a.id}
              id={a.id}
              title={a.title}
              done={a.done}
              dueDate={a.dueDate}
              priority={a.priority}
              verknuepfung={verknuepfung(a)}
            />
          ))
        )}
      </div>

      {erledigte.length > 0 && (
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">
            Erledigt ({erledigte.length})
          </p>
          <div className="space-y-2">
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
    </div>
  );
}
