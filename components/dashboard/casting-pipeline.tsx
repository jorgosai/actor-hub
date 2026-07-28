import Link from "next/link";

export type Stufe = { label: string; anzahl: number };

/* Je weiter in der Pipeline, desto kräftiger — „Gebucht" ist der Erfolg. */
const FARBEN = [
  "bg-chart-5",
  "bg-chart-4",
  "bg-chart-3",
  "bg-chart-2",
  "bg-chart-1",
  "bg-brand",
];

export function CastingPipeline({
  stufen,
  gesamt,
}: {
  stufen: Stufe[];
  gesamt: number;
}) {
  const max = Math.max(1, ...stufen.map((s) => s.anzahl));

  return (
    <section
      className={`animate-rise h-full rounded-4xl bg-card p-6 sm:p-7 ah-kante`}
      style={{ animationDelay: "360ms" }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-card-foreground">
            Casting-Pipeline
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Deine Bewerbungen nach Phase</p>
        </div>
        <Link
          href="/bewerbungen"
          className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-accent"
        >
          {gesamt} gesamt
        </Link>
      </div>

      <div className="mt-7 flex flex-col gap-3.5">
        {stufen.map((stufe, i) => {
          const pct = (stufe.anzahl / max) * 100;
          return (
            <div key={stufe.label} className="flex items-center gap-4">
              <span className="w-[4.5rem] shrink-0 text-sm font-medium text-muted-foreground">
                {stufe.label}
              </span>
              <div className="relative h-10 flex-1 overflow-hidden rounded-2xl bg-secondary">
                {stufe.anzahl > 0 && (
                  <div
                    className={`animate-grow-x h-full rounded-2xl ${FARBEN[i] ?? "bg-chart-5"}`}
                    style={{
                      width: `${Math.max(pct, 9)}%`,
                      animationDelay: `${420 + i * 80}ms`,
                    }}
                  />
                )}
              </div>
              <span className={`w-6 shrink-0 text-right text-lg font-semibold tabular-nums ${stufe.anzahl > 0 ? "text-brand" : "text-card-foreground"} font-serif text-[calc(1.125rem*var(--serif-skala))]`}>
                {stufe.anzahl}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
