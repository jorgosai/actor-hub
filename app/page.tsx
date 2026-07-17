import { prisma } from "@/lib/db";
import Link from "next/link";

const STATUS_FARBEN: Record<string, string> = {
  Beworben: "bg-blue-100 text-blue-800",
  Eingeladen: "bg-yellow-100 text-yellow-800",
  Callback: "bg-purple-100 text-purple-800",
  Angenommen: "bg-green-100 text-green-800",
  Abgesagt: "bg-red-100 text-red-800",
};

export default async function Home() {
  const [bewerbungen, kontakte, projekte] = await Promise.all([
    prisma.application.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.contact.count(),
    prisma.project.findMany({ where: { status: "Laufend" } }),
  ]);

  const offeneBewerbungen = bewerbungen.filter(
    (b) => b.status !== "Angenommen" && b.status !== "Abgesagt"
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Willkommen zurück</h1>
      <p className="text-neutral-500 mb-8">Hier ist dein aktueller Überblick.</p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <Link href="/bewerbungen" className="bg-white rounded-lg p-5 shadow-sm border border-neutral-200 hover:border-neutral-400 transition">
          <p className="text-sm text-neutral-500 mb-1">Offene Bewerbungen</p>
          <p className="text-3xl font-bold">{offeneBewerbungen.length}</p>
        </Link>
        <Link href="/kontakte" className="bg-white rounded-lg p-5 shadow-sm border border-neutral-200 hover:border-neutral-400 transition">
          <p className="text-sm text-neutral-500 mb-1">Kontakte</p>
          <p className="text-3xl font-bold">{kontakte}</p>
        </Link>
        <Link href="/projekte" className="bg-white rounded-lg p-5 shadow-sm border border-neutral-200 hover:border-neutral-400 transition">
          <p className="text-sm text-neutral-500 mb-1">Laufende Projekte</p>
          <p className="text-3xl font-bold">{projekte.length}</p>
        </Link>
      </div>

      <h2 className="text-lg font-semibold mb-4">Letzte Bewerbungen</h2>
      <div className="space-y-3">
        {bewerbungen.length === 0 ? (
          <p className="text-neutral-500 text-sm">Noch keine Bewerbungen.</p>
        ) : (
          bewerbungen.map((b) => (
            <div key={b.id} className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200 flex items-center justify-between">
              <div>
                <p className="font-medium">{b.role}</p>
                <p className="text-sm text-neutral-500">{b.production}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_FARBEN[b.status] ?? "bg-neutral-100"}`}>
                {b.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
