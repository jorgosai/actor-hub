/**
 * Blasser farbiger Lichtschein hinter dem gesamten Inhalt.
 * Vorbild: Contra und ClickUp — kein Farbblock, sondern Licht.
 */
export function Lichtschein() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background: [
          "radial-gradient(70rem 46rem at 8% -10%, color-mix(in oklch, var(--brand) 26%, transparent), transparent 68%)",
          "radial-gradient(55rem 40rem at 96% 4%, color-mix(in oklch, var(--akzent) 12%, transparent), transparent 68%)",
          "radial-gradient(60rem 40rem at 55% 108%, color-mix(in oklch, var(--brand) 10%, transparent), transparent 70%)",
        ].join(", "),
      }}
    />
  );
}
