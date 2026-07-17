import { prisma } from "@/lib/db";
import ProjektForm from "./ProjektForm";

const STATUS_FARBEN: Record<string, string> = {
  Laufend: "bg-green-100 text-green-800",
  Geplant: "bg-blue-100 text-blue-800",
  Abgeschlossen: "bg-neutral-100 text-neutral-600",
};

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
            <div key={p.id} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{p.title}</h2>
                  {p.role && <p className="text-sm text-neutral-500">Rolle: {p.role}</p>}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_FARBEN[p.status] ?? "bg-neutral-100"}`}>
                  {p.status}
                </span>
              </div>
              {(p.startDate || p.endDate) && (
                <p className="text-sm text-neutral-500 mt-2">
                  {p.startDate ? new Date(p.startDate).toLocaleDateString("de-DE") : "?"} –{" "}
                  {p.endDate ? new Date(p.endDate).toLocaleDateString("de-DE") : "laufend"}
                </p>
              )}
              {p.notes && <p className="text-sm text-neutral-600 mt-2">{p.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
