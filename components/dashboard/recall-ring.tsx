const RADIUS = 76;
const UMFANG = 2 * Math.PI * RADIUS;

export function RecallRing({
  prozent,
  erreicht,
  gesamt,
}: {
  prozent: number;
  erreicht: number;
  gesamt: number;
}) {
  const offset = UMFANG - (Math.min(100, Math.max(0, prozent)) / 100) * UMFANG;

  return (
    <section
      className="animate-rise flex h-full flex-col rounded-4xl bg-card p-6 sm:p-7"
      style={{ animationDelay: "400ms" }}
    >
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-card-foreground">
          Recall-Quote
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Über alle Castings</p>
      </div>

      <div className="relative mx-auto my-4 flex items-center justify-center">
        <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
          <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="var(--secondary)" strokeWidth="16" />
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={UMFANG}
            strokeDashoffset={offset}
          />
        </svg>
        {(
          <div
            className="pointer-events-none absolute h-40 w-40 rounded-full blur-2xl"
            style={{ background: "color-mix(in oklch, var(--akzent) 16%, transparent)" }}
          />
        )}
        <div className="absolute flex flex-col items-center">
          <span className={`tabular-nums text-card-foreground font-serif text-[calc(3rem*var(--serif-skala))]`}>
            {prozent}%
          </span>
          <span className="mt-1 text-xs font-medium text-muted-foreground">eingeladen</span>
        </div>
      </div>

      <div className="mt-auto rounded-2xl bg-stat-mint px-4 py-3 text-center text-sm font-medium text-stat-mint-foreground">
        {gesamt === 0 ? (
          "Noch keine Castings erfasst"
        ) : (
          <>
            <span className="font-semibold">{erreicht}</span> von {gesamt} kamen bis Recall
          </>
        )}
      </div>
    </section>
  );
}
