import Link from "next/link";
import { CHIP, KARTE, STATUS_CHIP, ZEILEN, chipTon } from "@/components/stil";

export type CastingZeile = {
  id: string;
  rolle: string;
  produktion: string;
  initialen: string;
  status: string;
};

/* Initialenkreise bleiben neutral — die Farbe trägt der Status rechts. */
const AVATAR = "bg-secondary text-secondary-foreground";

export function RecentCastings({ castings }: { castings: CastingZeile[] }) {
  return (
    <section
      className={`${KARTE} animate-rise h-full`}
      style={{ animationDelay: "520ms" }}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold tracking-tight text-card-foreground">
          Letzte Castings
        </h2>
        <Link
          href="/bewerbungen"
          className="text-sm font-medium text-brand transition-opacity hover:opacity-70"
        >
          Alle
        </Link>
      </div>

      {castings.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Noch keine Castings erfasst.{" "}
          <Link href="/bewerbungen" className="font-medium text-brand hover:underline">
            Erstes anlegen
          </Link>
        </p>
      ) : (
        <ul className={`mt-4 ${ZEILEN}`}>
          {castings.map((c) => (
            <li key={c.id}>
              <Link
                href="/bewerbungen"
                className="-mx-2 flex items-center gap-4 rounded-2xl px-2 py-3.5 transition-colors duration-200 hover:bg-secondary"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${AVATAR}`}
                >
                  {c.initialen}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-card-foreground">{c.rolle}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.produktion}</p>
                </div>
                <span className={`${CHIP} shrink-0 ${chipTon(STATUS_CHIP, c.status)}`}>
                  {c.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
