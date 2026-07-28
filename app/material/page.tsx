import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import MaterialForm from "./MaterialForm";
import MaterialItem from "./MaterialItem";
import { SeitenKopf } from "@/components/seiten-kopf";
import { KARTE, ZEILEN } from "@/components/stil";

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

  const jetzt = new Date().getTime();

  function alterMonate(d: Date): number {
    return Math.floor((jetzt - new Date(d).getTime()) / (30.44 * 86400000));
  }

  return (
    <>
      <SeitenKopf
        eyebrow="Arbeit"
        titel="Material"
        beschreibung={
          material.length > 0
            ? `${material.length} ${material.length === 1 ? "Eintrag" : "Einträge"} — Headshots, Vita, Showreel und alles, was du verschickst.`
            : "Headshots, Vita, Showreel — hier liegt alles, was du verschickst, mit Datum."
        }
      />

      <MaterialForm />

      <div className="space-y-8">
        {material.length === 0 ? (
          <div className="text-muted-foreground text-sm space-y-1">
            <p>Noch kein Material eingetragen.</p>
            <p className="text-muted-foreground/80">
              Hier sammelst du Links zu deinem Showreel, Headshots, Vita, Voice Demos — mit Versionen,
              damit du immer weißt was aktuell ist.
            </p>
          </div>
        ) : (
          gruppen.map((g) => (
            <div key={g.typ}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {g.typ} ({g.eintraege.length})
              </p>
              <div className={`${KARTE} ${ZEILEN} py-1`}>
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
    </>
  );
}
