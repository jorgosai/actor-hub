"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, X } from "lucide-react";
import {
  CHIP_KLEIN,
  CHIP_LEISE,
  CHIP_MARKE,
  ICON_KNOPF_LOESCHEN,
  KNOPF_KLEIN,
} from "@/components/stil";

type Props = {
  id: string;
  name: string;
  url: string | null;
  version: string | null;
  current: boolean;
  notes: string | null;
  alterMonate: number;
  altersWarnung: boolean;
};

export default function MaterialItem({ id, name, url, version, current, notes, alterMonate, altersWarnung }: Props) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Material "${name}" wirklich löschen?`)) return;
    await fetch(`/api/material/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function markiereAktuell() {
    await fetch(`/api/material/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: true }),
    });
    router.refresh();
  }

  return (
    <div
      className={`flex items-center gap-3 px-1 py-3.5 ${current ? "" : "opacity-65"}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">{name}</p>
          {version && <span className={`${CHIP_KLEIN} ${CHIP_LEISE}`}>{version}</span>}
          {current && <span className={`${CHIP_KLEIN} ${CHIP_MARKE}`}>Aktuell</span>}
        </div>
        <p className={`text-xs mt-0.5 ${altersWarnung && current ? "text-destructive font-medium" : "text-muted-foreground/80"}`}>
          {alterMonate === 0
            ? "Diesen Monat hinzugefügt"
            : `${alterMonate} ${alterMonate === 1 ? "Monat" : "Monate"} alt`}
          {altersWarnung && current ? " — Zeit für ein Update?" : ""}
        </p>
        {notes && <p className="text-xs text-muted-foreground mt-1">{notes}</p>}
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${KNOPF_KLEIN} shrink-0 whitespace-nowrap`}
        >
          Öffnen
          <ExternalLink className="h-3 w-3" />
        </a>
      )}

      {!current && (
        <button
          onClick={markiereAktuell}
          className="shrink-0 whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Als aktuell markieren
        </button>
      )}

      <button onClick={handleDelete} className={ICON_KNOPF_LOESCHEN} title="Löschen">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
