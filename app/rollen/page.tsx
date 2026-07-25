import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import Link from "next/link";
import RolleForm from "./RolleForm";

const STATUS_FARBEN: Record<string, string> = {
  "In Arbeit": "bg-blue-100 text-blue-800",
  Gespielt: "bg-green-100 text-green-800",
  Archiv: "bg-neutral-100 text-neutral-500",
};

export default async function RollenPage() {
  const userId = await getUserId();
  const rollen = await prisma.role.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Rollen</h1>
        <p className="text-sm text-neutral-500">{rollen.length} Rollen</p>
      </div>

      <RolleForm />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {rollen.length === 0 ? (
          <div className="md:col-span-2 text-neutral-500 text-sm space-y-1">
            <p>Noch keine Rollen angelegt.</p>
            <p className="text-neutral-400">
              Jede Rolle bekommt eine eigene Seite mit Charakterarbeit — Biografie, Ziele,
              Hindernisse, Subtext — und einem KI-Acting-Coach der deine Rolle kennt.
            </p>
          </div>
        ) : (
          rollen.map((r) => {
            const ausgefuellt = [r.biography, r.goals, r.obstacles, r.relationships, r.subtext].filter(Boolean).length;
            return (
              <Link key={r.id} href={`/rollen/${r.id}`}>
                <div className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-400 hover:shadow-sm transition cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="font-semibold text-lg">{r.name}</h2>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_FARBEN[r.status] ?? "bg-neutral-100"}`}>
                      {r.status}
                    </span>
                  </div>
                  {r.production && <p className="text-sm text-neutral-500 mb-3">{r.production}</p>}
                  <p className="text-xs text-neutral-400">
                    Charakterarbeit: {ausgefuellt} von 5 Bereichen ausgefüllt
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
