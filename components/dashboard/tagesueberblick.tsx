import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

/**
 * Der Aufmacher oben auf dem Dashboard.
 *
 * Bewusst ohne KI-Aufruf: Dieser Text wird aus den vorhandenen Daten
 * zusammengesetzt. Sonst würde jeder Seitenaufruf eine kostenpflichtige
 * Anfrage auslösen. Für die echte Analyse führt der Knopf zum Assistenten.
 */
export function Tagesueberblick({
  kernsatz,
  zusatz,
}: {
  kernsatz: string;
  zusatz: string;
}) {
  return (
    <section
      className="animate-rise relative overflow-hidden rounded-4xl p-5 text-brand-foreground sm:p-7 lg:p-9"
      style={{
        animationDelay: "80ms",
        background:
          "linear-gradient(135deg, color-mix(in oklch, var(--brand) 88%, black) 0%, color-mix(in oklch, var(--brand) 68%, black) 100%)",
      }}
      aria-label="Tagesüberblick"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-foreground/10 blur-2xl" />

      <div className="relative flex flex-col gap-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-foreground/15 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          Dein Tag
        </span>

        <p className="max-w-3xl text-balance font-serif text-[calc(1.35rem*var(--serif-skala))] leading-[1.3] sm:text-[calc(1.9rem*var(--serif-skala))] lg:text-[calc(2.4rem*var(--serif-skala))]">
          {kernsatz}
        </p>
        {zusatz && (
          <p className="max-w-3xl text-sm leading-relaxed text-brand-foreground/75">{zusatz}</p>
        )}

        <Link
          href="/assistent"
          className="group mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-brand-foreground/15 px-4 py-2.5 text-sm font-semibold backdrop-blur transition-colors duration-200 hover:bg-brand-foreground/25"
        >
          KI-Assistent fragen
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
