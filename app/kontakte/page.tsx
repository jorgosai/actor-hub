import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { SeitenKopf } from "@/components/seiten-kopf";
import KontaktForm from "./KontaktForm";
import KontaktKarte from "./KontaktKarte";

const PFLEGE_TAGE = 90;

export default async function KontaktePage() {
  const userId = await getUserId();
  const kontakte = await prisma.contact.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  const jetzt = new Date().getTime();
  const grenze = new Date(jetzt - PFLEGE_TAGE * 86400000);
  const pflegeFaellig = kontakte.filter(
    (k) => !k.lastContact || new Date(k.lastContact) < grenze
  );
  const aktuelle = kontakte.filter(
    (k) => k.lastContact && new Date(k.lastContact) >= grenze
  );

  return (
    <>
      <SeitenKopf
        eyebrow="Arbeit"
        titel="Kontakte"
        beschreibung={
          kontakte.length > 0
            ? `${kontakte.length} ${kontakte.length === 1 ? "Kontakt" : "Kontakte"} — Beziehungen brauchen Pflege, nicht nur Anlässe.`
            : "Agenten, Casterinnen, Regie, Kolleginnen — hier sammelst du, wer dich kennt."
        }
      />

      <KontaktForm />

      {pflegeFaellig.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-destructive">
            Pflege fällig — über {PFLEGE_TAGE} Tage kein Kontakt ({pflegeFaellig.length})
          </p>
          <div className="flex flex-col gap-4">
            {pflegeFaellig.map((k) => (
              <KontaktKarte
                key={k.id}
                id={k.id}
                name={k.name}
                category={k.category}
                company={k.company}
                email={k.email}
                phone={k.phone}
                notes={k.notes}
                lastContact={k.lastContact}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        {aktuelle.length > 0 && pflegeFaellig.length > 0 && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Aktuell ({aktuelle.length})
          </p>
        )}
        <div className="flex flex-col gap-4">
          {kontakte.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Kontakte eingetragen.</p>
          ) : (
            aktuelle.map((k) => (
              <KontaktKarte
                key={k.id}
                id={k.id}
                name={k.name}
                category={k.category}
                company={k.company}
                email={k.email}
                phone={k.phone}
                notes={k.notes}
                lastContact={k.lastContact}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
