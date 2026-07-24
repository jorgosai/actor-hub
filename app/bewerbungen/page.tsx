import { prisma } from "@/lib/db";
import BewerbungForm from "./BewerbungForm";
import BewerbungKarte from "./BewerbungKarte";

const PIPELINE = ["Anfrage", "Beworben", "Self Tape", "Recall", "Callback", "Gebucht"];

export default async function BewerbungenPage() {
  const [bewerbungen, kontakte] = await Promise.all([
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      include: { contact: true },
    }),
    prisma.contact.findMany({ orderBy: { name: "asc" } }),
  ]);

  const counts = PIPELINE.map((stufe) => ({
    stufe,
    anzahl: bewerbungen.filter((b) => b.status === stufe).length,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Castings</h1>
      </div>

      {/* Pipeline Übersicht */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-4">Pipeline</p>
        <div className="flex items-center">
          {counts.map((c, i) => (
            <div key={c.stufe} className="flex items-center flex-1 last:flex-none">
              <div className="text-center flex-1">
                <p className={`text-2xl font-light ${c.anzahl > 0 ? "text-neutral-900" : "text-neutral-300"}`}>
                  {c.anzahl}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5 whitespace-nowrap">{c.stufe}</p>
              </div>
              {i < counts.length - 1 && <span className="text-neutral-300 px-1">›</span>}
            </div>
          ))}
        </div>
      </div>

      <BewerbungForm kontakte={kontakte} />
      <div className="mt-8 space-y-4">
        {bewerbungen.length === 0 ? (
          <p className="text-neutral-500">Noch keine Castings eingetragen.</p>
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
    </div>
  );
}
