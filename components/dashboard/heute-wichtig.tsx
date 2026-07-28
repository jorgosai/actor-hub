import Link from "next/link";
import { CalendarClock, CircleAlert, ListChecks, Reply } from "lucide-react";
import { CHIP_KLEIN, CHIP_LEISE, CHIP_WARNUNG, KARTE, ZEILEN } from "@/components/stil";

export type Eintrag = {
  id: string;
  titel: string;
  unterzeile: string;
  marke: string;
  href: string;
  dringend?: boolean;
  /** Bestimmt das Icon der Zeile — nicht mehr die Farbe. */
  art: "termin" | "deadline" | "followup" | "aufgabe";
};

const ICONS = {
  termin: CalendarClock,
  deadline: CircleAlert,
  followup: Reply,
  aufgabe: ListChecks,
};

/* Farbe sitzt nur auf der kleinen Icon-Fläche — Vorbild: Mobbin, Uvodo. */
const ICON_TON = {
  termin: "bg-brand text-brand-foreground",
  deadline: "bg-akzent text-akzent-foreground",
  followup: "bg-brand/70 text-brand-foreground",
  aufgabe: "bg-brand/45 text-brand-foreground",
};

export function HeuteWichtig({ eintraege }: { eintraege: Eintrag[] }) {
  return (
    <section className={`${KARTE} animate-rise h-full`} style={{ animationDelay: "460ms" }}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold tracking-tight text-card-foreground">
          Heute wichtig
        </h2>
        <Link
          href="/aufgaben"
          className="text-sm font-medium text-brand transition-opacity hover:opacity-70"
        >
          Alle
        </Link>
      </div>

      {eintraege.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Nichts Dringendes. Guter Moment, um an einer Rolle zu arbeiten.
        </p>
      ) : (
        <ul className={`mt-4 ${ZEILEN}`}>
          {eintraege.map((e) => {
            const Icon = ICONS[e.art];
            return (
              <li key={e.id}>
                <Link
                  href={e.href}
                  className="-mx-2 flex items-center gap-3.5 rounded-2xl px-2 py-3.5 transition-colors duration-200 hover:bg-secondary"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${ICON_TON[e.art]}`}>
                    <Icon className="h-[17px] w-[17px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-card-foreground">{e.titel}</p>
                    <p className="truncate text-xs text-muted-foreground">{e.unterzeile}</p>
                  </div>
                  <span
                    className={`shrink-0 tabular-nums ${CHIP_KLEIN} ${
                      e.dringend ? CHIP_WARNUNG : CHIP_LEISE
                    }`}
                  >
                    {e.marke}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
