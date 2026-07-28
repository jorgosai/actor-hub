"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  CHIP_KLEIN,
  CHIP_LEISE,
  CHIP_MARKE,
  CHIP_NEUTRAL,
  ICON_KNOPF_LOESCHEN,
  TON,
} from "@/components/stil";

const TYP_CHIP: Record<string, string> = {
  Casting: TON.sky,
  Dreh: CHIP_MARKE,
  Probe: TON.mint,
  Auftritt: TON.peach,
  Training: TON.butter,
  Meeting: CHIP_NEUTRAL,
  Sonstiges: CHIP_NEUTRAL,
};

type Props = {
  id: string;
  title: string;
  type: string;
  date: Date;
  location: string | null;
  notes: string | null;
  verknuepfung?: string | null;
};

export default function TerminItem({ id, title, type, date, location, notes, verknuepfung }: Props) {
  const router = useRouter();
  const d = new Date(date);
  const hatUhrzeit = d.getHours() !== 0 || d.getMinutes() !== 0;

  async function handleDelete() {
    if (!confirm(`Termin "${title}" wirklich löschen?`)) return;
    await fetch(`/api/termine/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4 px-1 py-3.5">
      <div className="w-12 shrink-0 text-center">
        {hatUhrzeit ? (
          <p className="text-sm font-semibold text-foreground">
            {d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground/80">ganztags</p>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground/80 mt-0.5">
          {location && <span>{location}</span>}
          {location && verknuepfung && " · "}
          {verknuepfung && <span>{verknuepfung}</span>}
        </p>
        {notes && <p className="text-xs text-muted-foreground mt-1">{notes}</p>}
      </div>

      <span className={`${CHIP_KLEIN} shrink-0 whitespace-nowrap ${TYP_CHIP[type] ?? CHIP_LEISE}`}>
        {type}
      </span>

      <button onClick={handleDelete} className={ICON_KNOPF_LOESCHEN} title="Löschen">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
