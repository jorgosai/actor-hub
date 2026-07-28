import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { SeitenKopf } from "@/components/seiten-kopf";
import { KARTE } from "@/components/stil";
import BewerbungForm from "./BewerbungForm";
import BewerbungKarte from "./BewerbungKarte";

const PIPELINE = ["Anfrage", "Beworben", "Self Tape", "Recall", "Callback", "Gebucht"];

export default async function BewerbungenPage() {
  const userId = await getUserId();
  const [bewerbungen, kontakte] = await Promise.all([
    prisma.application.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: { contact: true },
    }),
    prisma.contact.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  ]);

  const counts = PIPELINE.map((stufe) => ({
    stufe,
    anzahl: bewerbungen.filter((b) => b.status === stufe).length,
  }));

  const gesamt = bewerbungen.length;

  return (
    <>
      <SeitenKopf
        eyebrow="Arbeit"
        titel="Castings"
        beschreibung={
          gesamt > 0
            ? `${gesamt} ${gesamt === 1 ? "Bewerbung" : "Bewerbungen"} insgesamt — vom ersten Kontakt bis zur Zusage.`
            : "Trag deine erste Bewerbung ein, dann füllt sich die Pipeline."
        }
      />

      {/* Pipeline Übersicht */}
      <section className={`${KARTE} animate-rise`} style={{ animationDelay: "80ms" }}>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Pipeline
        </p>
        {/*
          Auf dem Handy als Raster mit drei Spalten — nebeneinander passen
          sechs Stufen nicht, „Gebucht" wurde sonst abgeschnitten.
          Ab Tablet wieder als Reihe mit Pfeilen dazwischen.
        */}
        <div className="mt-5 grid grid-cols-3 gap-y-5 sm:flex sm:items-center sm:gap-y-0">
          {counts.map((c, i) => (
            <div key={c.stufe} className="flex items-center sm:flex-1 sm:last:flex-none">
              <div className="flex-1 text-center">
                <p
                  className={`font-serif text-[calc(1.7rem*var(--serif-skala))] tabular-nums sm:text-[calc(2rem*var(--serif-skala))] ${
                    c.anzahl > 0 ? "text-card-foreground" : "text-muted-foreground/35"
                  }`}
                >
                  {c.anzahl}
                </p>
                <p className="mt-1 whitespace-nowrap text-[11px] text-muted-foreground sm:text-xs">
                  {c.stufe}
                </p>
              </div>
              {i < counts.length - 1 && (
                <span aria-hidden className="hidden px-1 text-muted-foreground/35 sm:inline">
                  ›
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <BewerbungForm kontakte={kontakte} />
      <div className="flex flex-col gap-4">
        {bewerbungen.length === 0 ? (
          <p className="text-sm text-muted-foreground">Noch keine Castings eingetragen.</p>
        ) : (
          bewerbungen.map((b) => (
            <BewerbungKarte
              key={b.id}
              id={b.id}
              role={b.role}
              production={b.production}
              status={b.status}
              notes={b.notes}
              followUpAt={b.followUpAt}
              deadline={b.deadline}
              contactName={b.contact?.name}
              contactId={b.contactId}
              kontakte={kontakte}
            />
          ))
        )}
      </div>
    </>
  );
}
