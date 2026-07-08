import { prisma } from "@/lib/db";
import BewerbungForm from "./BewerbungForm";

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
            <div key={b.id} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{b.role}</h2>
                  <p className="text-sm text-neutral-500">{b.production}</p>
                </div>
                <span className="text-xs bg-neutral-100 px-3 py-1 rounded-full">{b.status}</span>
              </div>
              {b.notes && <p className="text-sm text-neutral-600 mt-2">{b.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}