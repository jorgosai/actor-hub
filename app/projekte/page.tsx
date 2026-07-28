import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import ProjektForm from "./ProjektForm";
import ProjektKarte from "./ProjektKarte";
import { SeitenKopf } from "@/components/seiten-kopf";

export default async function ProjektePage() {
  const userId = await getUserId();
  const projekte = await prisma.project.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return (
    <>
      <SeitenKopf
        eyebrow="Arbeit"
        titel="Projekte"
        beschreibung={
          projekte.length > 0
            ? `${projekte.length} ${projekte.length === 1 ? "Projekt" : "Projekte"} — geplant, laufend und abgeschlossen.`
            : "Alles, was du tatsächlich spielst — von der Zusage bis zur letzten Vorstellung."
        }
      />
      <ProjektForm />
      <div className="space-y-4">
        {projekte.length === 0 ? (
          <p className="text-muted-foreground">Noch keine Projekte eingetragen.</p>
        ) : (
          projekte.map((p) => (
            <ProjektKarte
              key={p.id}
              id={p.id}
              title={p.title}
              role={p.role}
              status={p.status}
              startDate={p.startDate}
              endDate={p.endDate}
              notes={p.notes}
            />
          ))
        )}
      </div>
    </>
  );
}
