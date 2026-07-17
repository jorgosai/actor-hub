import { prisma } from "@/lib/db";
import BewerbungForm from "./BewerbungForm";
import BewerbungKarte from "./BewerbungKarte";

export default async function BewerbungenPage() {
  const bewerbungen = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Bewerbungen</h1>
      </div>
      <BewerbungForm />
      <div className="mt-8 space-y-4">
        {bewerbungen.length === 0 ? (
          <p className="text-neutral-500">Noch keine Bewerbungen eingetragen.</p>
        ) : (
          bewerbungen.map((b) => (
            <BewerbungKarte
              key={b.id}
              id={b.id}
              role={b.role}
              production={b.production}
              status={b.status}
              notes={b.notes}
            />
          ))
        )}
      </div>
    </div>
  );
}