import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import Link from "next/link";
import { SeitenKopf } from "@/components/seiten-kopf";
import { CHIP, KARTE_HOVER, ROLLE_CHIP, chipTon } from "@/components/stil";
import RolleForm from "./RolleForm";

export default async function RollenPage() {
  const userId = await getUserId();
  const rollen = await prisma.role.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <SeitenKopf
        eyebrow="Arbeit"
        titel="Rollen"
        beschreibung={
          rollen.length > 0
            ? `${rollen.length} ${rollen.length === 1 ? "Rolle" : "Rollen"} — jede mit eigener Charakterarbeit und KI-Coach.`
            : "Jede Rolle bekommt eine eigene Seite für Charakterarbeit — und einen KI-Coach, der sie kennt."
        }
      />

      <RolleForm />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {rollen.length === 0 ? (
          <p className="text-sm text-muted-foreground md:col-span-2">
            Noch keine Rollen angelegt. Leg deine erste an — Biografie, Ziele, Hindernisse,
            Beziehungen und Subtext bekommen dort jeweils einen eigenen Platz.
          </p>
        ) : (
          rollen.map((r, i) => {
            const ausgefuellt = [
              r.biography,
              r.goals,
              r.obstacles,
              r.relationships,
              r.subtext,
            ].filter(Boolean).length;
            return (
              <Link
                key={r.id}
                href={`/rollen/${r.id}`}
                className={`${KARTE_HOVER} animate-rise block`}
                style={{ animationDelay: `${80 + i * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold tracking-tight text-card-foreground">
                    {r.name}
                  </h2>
                  <span className={`${CHIP} shrink-0 ${chipTon(ROLLE_CHIP, r.status)}`}>
                    {r.status}
                  </span>
                </div>
                {r.production && (
                  <p className="mt-1 text-sm text-muted-foreground">{r.production}</p>
                )}

                {/* Fortschritt der Charakterarbeit — fünf Striche, keine Prozentzahl */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex flex-1 gap-1.5">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <span
                        key={n}
                        className={`h-1.5 flex-1 rounded-full ${
                          n < ausgefuellt ? "bg-brand" : "bg-secondary"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {ausgefuellt} von 5
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
