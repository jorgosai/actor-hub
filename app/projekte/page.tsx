import { prisma } from "@/lib/db";
import ProjektForm from "./ProjektForm";
import ProjektKarte from "./ProjektKarte";

export default async function ProjektePage() {
  const projekte = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Projekte</h1>
      </div>
      <ProjektForm />
      <div className="mt-8 space-y-4">
        {projekte.length === 0 ? (
          <p className="text-neutral-500">Noch keine Projekte eingetragen.</p>
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
    </div>
  );
}
