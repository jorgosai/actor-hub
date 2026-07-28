import type { ReactNode } from "react";


/** Einheitlicher Seitenkopf: Eyebrow, Titel, optionaler Nebensatz und Aktion. */
export function SeitenKopf({
  eyebrow,
  titel,
  beschreibung,
  aktion,
}: {
  eyebrow?: string;
  titel: string;
  beschreibung?: string;
  aktion?: ReactNode;
}) {
  return (
    <header className="animate-rise flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1.5 text-foreground font-serif text-[calc(2.25rem*var(--serif-skala))] leading-[1.1] sm:text-[calc(3rem*var(--serif-skala))]">
          {titel}
        </h1>
        {beschreibung && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{beschreibung}</p>
        )}
      </div>
      {aktion}
    </header>
  );
}
