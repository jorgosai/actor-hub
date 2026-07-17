import { prisma } from "@/lib/db";
import KontaktForm from "./KontaktForm";

const KATEGORIE_FARBEN: Record<string, string> = {
  Agent: "bg-blue-100 text-blue-800",
  Casting: "bg-purple-100 text-purple-800",
  Regisseur: "bg-yellow-100 text-yellow-800",
  Produzent: "bg-orange-100 text-orange-800",
  Kollege: "bg-green-100 text-green-800",
  Sonstiges: "bg-neutral-100 text-neutral-800",
};

export default async function KontaktePage() {
  const kontakte = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Kontakte</h1>
      </div>
      <KontaktForm />
      <div className="mt-8 space-y-4">
        {kontakte.length === 0 ? (
          <p className="text-neutral-500">Noch keine Kontakte eingetragen.</p>
        ) : (
          kontakte.map((k) => (
            <div key={k.id} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{k.name}</h2>
                  {k.company && <p className="text-sm text-neutral-500">{k.company}</p>}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${KATEGORIE_FARBEN[k.category] ?? "bg-neutral-100"}`}>
                  {k.category}
                </span>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-neutral-500">
                {k.email && <span>{k.email}</span>}
                {k.phone && <span>{k.phone}</span>}
              </div>
              {k.notes && <p className="text-sm text-neutral-600 mt-2">{k.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
