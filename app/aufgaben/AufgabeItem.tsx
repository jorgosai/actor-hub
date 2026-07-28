"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import {
  CHIP_KLEIN,
  HAKEN_AN,
  HAKEN_AUS,
  CHIP_LEISE,
  CHIP_WARNUNG,
  ICON_KNOPF_LOESCHEN,
} from "@/components/stil";

const PRIO_CHIP: Record<string, string> = {
  Hoch: CHIP_WARNUNG,
  Normal: CHIP_LEISE,
  Niedrig: CHIP_LEISE,
};

type Props = {
  id: string;
  title: string;
  done: boolean;
  dueDate: Date | null;
  priority: string;
  verknuepfung?: string | null;
};

export default function AufgabeItem({ id, title, done, dueDate, priority, verknuepfung }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  const ueberfaellig = !done && dueDate && new Date(dueDate) < heute;

  async function toggle() {
    setBusy(true);
    await fetch(`/api/aufgaben/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !done }),
    });
    setBusy(false);
    router.refresh();
  }

  async function handleDelete() {
    await fetch(`/api/aufgaben/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 px-1 py-3.5">
      <button
        onClick={toggle}
        disabled={busy}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          done ? HAKEN_AN : HAKEN_AUS
        }`}
        title={done ? "Als offen markieren" : "Als erledigt markieren"}
      >
        {done && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${done ? "line-through text-muted-foreground/80" : "text-foreground"}`}>{title}</p>
        {verknuepfung && <p className="text-xs text-muted-foreground/80 mt-0.5">{verknuepfung}</p>}
      </div>

      {dueDate && (
        <span className={`text-xs whitespace-nowrap ${ueberfaellig ? "text-destructive font-medium" : "text-muted-foreground/80"}`}>
          {new Date(dueDate).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
          {ueberfaellig ? " — überfällig" : ""}
        </span>
      )}

      {priority !== "Normal" && (
        <span className={`${CHIP_KLEIN} shrink-0 whitespace-nowrap ${PRIO_CHIP[priority]}`}>
          {priority}
        </span>
      )}

      <button onClick={handleDelete} className={ICON_KNOPF_LOESCHEN} title="Löschen">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
