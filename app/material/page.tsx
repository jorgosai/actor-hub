import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import MaterialForm from "./MaterialForm";
import MaterialItem from "./MaterialItem";

const TYP_REIHENFOLGE = ["Showreel", "Headshot", "Vita", "Voice Demo", "Self Tape", "Presse", "Sonstiges"];

// Ab wann gilt Material als veraltet (in Monaten)
const ALTERS_GRENZEN: Record<string, number> = {
  Showreel: 12,
  Headshot: 24,
  Vita: 6,
  "Voice Demo": 18,
};

export default async function MaterialPage() {
  const userId = await getUserId();
  const material = await prisma.material.findMany({
    where: { userId },
    orderBy: [{ current: "desc" }, { createdAt: "desc" }],
  });

  const gruppen = TYP_REIHENFOLGE.map((typ) => ({
    typ,
    eintraege: material.filter((m) => m.type === typ),
  })).filter((g) => g.eintraege.length > 0);

  function alterMonate(d: Date): number {
    return Math.floor((Date.now() - new Date(d).getTime()) / (30.44 * 86400000));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Material</h1>
        <p className="text-sm text-neutral-500">{material.length} Einträge</p>
      </div>

      <MaterialForm />

      <div className="mt-8 space-y-8">
        {material.length === 0 ? (
          <div className="text-neutral-500 text-sm space-y-1">
            <p>Noch kein Material eingetragen.</p>
            <p className="text-neutral-400">
              Hier sammelst du Links zu deinem Showreel, Headshots, Vita, Voice Demos — mit Versionen,
              damit du immer weißt was aktuell ist.
            </p>
          </div>
        ) : (
          gruppen.map((g) => (
            <div key={g.typ}>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">
                {g.typ} ({g.eintraege.length})
              </p>
              <div className="space-y-2">
                {g.eintraege.map((m) => {
                  const monate = alterMonate(m.createdAt);
                  const grenze = ALTERS_GRENZEN[m.type];
                  return (
                    <MaterialItem
                      key={m.id}
                      id={m.id}
                      name={m.name}
                      url={m.url}
                      version={m.version}
                      current={m.current}
                      notes={m.notes}
                      createdAt={m.createdAt}
                      alterMonate={monate}
                      altersWarnung={grenze !== undefined && monate >= grenze}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
