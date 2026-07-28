/*
  Gemeinsame Stilbausteine.
  Alle Seiten ziehen aus dieser Datei, damit ein Farbwechsel in globals.css
  überall gleichzeitig ankommt und nichts mit festen Tailwind-Farben ausschert.
*/

/* ── Flächen ──────────────────────────────────────────────────
   Karten trennen sich über den Helligkeitsunterschied zum Hintergrund,
   nicht über Schatten. Alle Referenzen verzichten fast vollständig darauf. */
export const KARTE = "rounded-3xl bg-card p-5 sm:p-6";
export const KARTE_HOVER =
  "rounded-3xl bg-card p-5 ring-1 ring-transparent transition-[background-color,box-shadow] duration-200 hover:bg-accent/35 hover:ring-border sm:p-6";

/* Trennlinie zwischen Zeilen innerhalb einer Karte. */
export const ZEILEN = "divide-y divide-border/70";

/* ── Chips ────────────────────────────────────────────────────
   Zwei Stärken, bewusst getrennt:
   KRÄFTIG trägt den Hauptstatus eines Eintrags, LEISE alles Beiläufige
   (Daten, Kategorien, Versionen). Rangfolge entsteht über Sättigung. */
export const CHIP =
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold";
export const CHIP_KLEIN =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium";
export const CHIP_NEUTRAL = "bg-secondary text-secondary-foreground";
export const CHIP_LEISE = "bg-secondary text-muted-foreground";
export const CHIP_MARKE = "bg-brand text-brand-foreground";
/** Erfolg — trägt die Akzentfarbe, sonst nichts. */
export const CHIP_AKZENT = "bg-akzent text-akzent-foreground";
export const CHIP_WARNUNG = "bg-destructive/12 text-destructive";

/* Kennzahl-Beschriftung: winzige graue Kapitälchen unter der großen Zahl. */
export const KENNZAHL_LABEL =
  "text-[11px] font-semibold uppercase tracking-[0.12em]";

/*
  Kleine Elemente dürfen voll gesättigt sein.
  Die Regel aus den Referenzen lautet nicht „wenig Farbe", sondern:
  Fläche mal Sättigung bleibt konstant. Eine große Fläche muss gedeckt sein,
  ein Häkchen von 12 Pixeln darf leuchten. Superpower, Mobbin und Wise
  machen genau das.
*/
export const HAKEN_AN = "border-akzent bg-akzent text-akzent-foreground";
export const HAKEN_AUS = "border-border hover:border-akzent/60";

/** Getönte Flächen — dieselben vier Töne wie die Kennzahl-Kacheln. */
export const TON = {
  sky: "bg-stat-sky text-stat-sky-foreground",
  mint: "bg-stat-mint text-stat-mint-foreground",
  peach: "bg-stat-peach text-stat-peach-foreground",
  butter: "bg-stat-butter text-stat-butter-foreground",
} as const;

export type TonName = keyof typeof TON;

/* ── Formular ─────────────────────────────────────────────── */
export const LABEL = "mb-1.5 block text-xs font-semibold text-muted-foreground";
export const FELD =
  "w-full rounded-xl border border-input bg-card px-3.5 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand focus:ring-2 focus:ring-brand/15";

/* ── Knöpfe ───────────────────────────────────────────────── */
const KNOPF_BASIS =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

export const KNOPF_PRIMAER = `${KNOPF_BASIS} bg-brand text-brand-foreground hover:bg-brand/90`;
export const KNOPF_SEKUNDAER = `${KNOPF_BASIS} bg-secondary text-secondary-foreground hover:bg-accent`;
export const KNOPF_UMRISS = `${KNOPF_BASIS} border border-border bg-card text-foreground hover:bg-secondary`;
export const KNOPF_GEIST = `${KNOPF_BASIS} text-muted-foreground hover:bg-secondary hover:text-foreground`;
export const KNOPF_KLEIN =
  "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";

/** Runder Icon-Knopf, z. B. Bearbeiten und Löschen an Karten. */
export const ICON_KNOPF =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";
export const ICON_KNOPF_LOESCHEN =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive";

/* ── Status-Zuordnungen ───────────────────────────────────── */

/*
  Casting-Pipeline als Leiter.
  Vier Stufen derselben Familie, von blass nach kräftig — je weiter ein
  Casting fortgeschritten ist, desto deutlicher die Markierung. „Gebucht"
  bricht mit Terrakotta aus, weil es das einzige Endergebnis ist, das zählt.
*/
export const STATUS_CHIP: Record<string, string> = {
  Anfrage: "chip-grau",
  Beworben: "chip-blau",
  "Self Tape": "chip-amber",
  Recall: "chip-violett",
  Callback: "chip-petrol",
  Gebucht: "chip-erfolg",
  Abgesagt: "chip-rot",
};

/** Kategorien und Typen sind Schlagwörter, kein Status — deshalb die leise Stufe. */
export const KATEGORIE_CHIP: Record<string, string> = {
  Agent: CHIP_LEISE,
  Casting: CHIP_LEISE,
  Regisseur: CHIP_LEISE,
  Produzent: CHIP_LEISE,
  Kollege: CHIP_LEISE,
  Sonstiges: CHIP_LEISE,
};

export const PROJEKT_CHIP: Record<string, string> = {
  Geplant: "chip-blau",
  Laufend: "chip-gruen",
  Abgeschlossen: "chip-grau",
  Abgesagt: "chip-rot",
};

export const ROLLE_CHIP: Record<string, string> = {
  Idee: "chip-grau",
  "In Arbeit": "chip-amber",
  Gespielt: "chip-gruen",
  Archiv: "chip-grau",
};

/** Termintyp ist ein Schlagwort — leise. Die Uhrzeit trägt die Information. */
export const TERMIN_CHIP: Record<string, string> = {
  Casting: CHIP_LEISE,
  Dreh: CHIP_LEISE,
  Probe: CHIP_LEISE,
  Vorstellung: CHIP_LEISE,
  Training: CHIP_LEISE,
  Sonstiges: CHIP_LEISE,
};

/** Nur „Hoch" verdient Aufmerksamkeit, der Rest bleibt still. */
export const PRIORITAET_CHIP: Record<string, string> = {
  Hoch: "chip-rot",
  Mittel: CHIP_LEISE,
  Niedrig: CHIP_LEISE,
};

export const MATERIAL_CHIP: Record<string, string> = {
  Headshot: CHIP_LEISE,
  Vita: CHIP_LEISE,
  Showreel: CHIP_LEISE,
  Selftape: CHIP_LEISE,
  Sonstiges: CHIP_LEISE,
};

/** Fällt ein Schlüssel durch, bleibt es neutral statt farblos zu brechen. */
export function chipTon(karte: Record<string, string>, wert: string): string {
  return karte[wert] ?? CHIP_NEUTRAL;
}
