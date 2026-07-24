"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: string;
  name: string;
  url: string | null;
  version: string | null;
  current: boolean;
  notes: string | null;
  createdAt: Date;
  alterMonate: number;
  altersWarnung: boolean;
};

export default function MaterialItem({ id, name, url, version, current, notes, createdAt, alterMonate, altersWarnung }: Props) {
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
    <div className={`bg-white rounded-lg px-4 py-3 shadow-sm border flex items-center gap-3 ${current ? "border-neutral-200" : "border-neutral-100 opacity-60"}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-900">{name}</p>
          {version && <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded">{version}</span>}
          {current && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Aktuell</span>}
        </div>
        <p className={`text-xs mt-0.5 ${altersWarnung && current ? "text-orange-600 font-medium" : "text-neutral-400"}`}>
          {alterMonate === 0
            ? "Diesen Monat hinzugefügt"
            : `${alterMonate} ${alterMonate === 1 ? "Monat" : "Monate"} alt`}
          {altersWarnung && current ? " — Zeit für ein Update?" : ""}
        </p>
        {notes && <p className="text-xs text-neutral-500 mt-1">{notes}</p>}
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs border border-neutral-300 rounded-full px-3 py-1 text-neutral-600 hover:bg-neutral-100 transition whitespace-nowrap"
        >
          Öffnen ↗
        </a>
      )}

      {!current && (
        <button
          onClick={markiereAktuell}
          className="text-xs text-neutral-400 hover:text-neutral-700 transition whitespace-nowrap"
        >
          Als aktuell markieren
        </button>
      )}

      <button onClick={handleDelete} className="text-neutral-300 hover:text-red-500 transition text-lg leading-none" title="Löschen">×</button>
    </div>
  );
}
