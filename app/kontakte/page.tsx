import { prisma } from "@/lib/db";
import KontaktForm from "./KontaktForm";
import KontaktKarte from "./KontaktKarte";

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
            <KontaktKarte
              key={k.id}
              id={k.id}
              name={k.name}
              category={k.category}
              company={k.company}
              email={k.email}
              phone={k.phone}
              notes={k.notes}
            />
          ))
        )}
      </div>
    </div>
  );
}
