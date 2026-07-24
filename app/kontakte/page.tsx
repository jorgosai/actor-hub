import { prisma } from "@/lib/db";
import KontaktForm from "./KontaktForm";
import KontaktKarte from "./KontaktKarte";

const PFLEGE_TAGE = 90;

export default async function KontaktePage() {
  const kontakte = await prisma.contact.findMany({
    orderBy: { name: "asc" },
  });

  const grenze = new Date(Date.now() - PFLEGE_TAGE * 86400000);
  const pflegeFaellig = kontakte.filter(
    (k) => !k.lastContact || new Date(k.lastContact) < grenze
  );
  const aktuelle = kontakte.filter(
    (k) => k.lastContact && new Date(k.lastContact) >= grenze
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Kontakte</h1>
        <p className="text-sm text-neutral-500">{kontakte.length} gesamt</p>
      </div>

      <KontaktForm />

      {pflegeFaellig.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500 mb-3">
            Pflege fällig — über {PFLEGE_TAGE} Tage kein Kontakt ({pflegeFaellig.length})
          </p>
          <div className="space-y-4">
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

      <div className="mt-8">
        {aktuelle.length > 0 && pflegeFaellig.length > 0 && (
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">
            Aktuell ({aktuelle.length})
          </p>
        )}
        <div className="space-y-4">
          {kontakte.length === 0 ? (
            <p className="text-neutral-500">Noch keine Kontakte eingetragen.</p>
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
    </div>
  );
}
