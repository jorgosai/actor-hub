"use client";

import { useRouter } from "next/navigation";

const TYP_FARBEN: Record<string, string> = {
  Casting: "bg-purple-100 text-purple-800",
  Dreh: "bg-red-100 text-red-800",
  Probe: "bg-blue-100 text-blue-800",
  Auftritt: "bg-amber-100 text-amber-800",
  Training: "bg-green-100 text-green-800",
  Meeting: "bg-teal-100 text-teal-800",
  Sonstiges: "bg-neutral-100 text-neutral-600",
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
    <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-neutral-200 flex items-center gap-4">
      <div className="text-center w-12 flex-shrink-0">
        {hatUhrzeit ? (
          <p className="text-sm font-semibold text-neutral-900">
            {d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
          </p>
        ) : (
          <p className="text-xs text-neutral-400">ganztags</p>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <p className="text-xs text-neutral-400 mt-0.5">
          {location && <span>{location}</span>}
          {location && verknuepfung && " · "}
          {verknuepfung && <span>{verknuepfung}</span>}
        </p>
        {notes && <p className="text-xs text-neutral-500 mt-1">{notes}</p>}
      </div>

      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap ${TYP_FARBEN[type] ?? "bg-neutral-100"}`}>
        {type}
      </span>

      <button onClick={handleDelete} className="text-neutral-300 hover:text-red-500 transition text-lg leading-none" title="Löschen">×</button>
    </div>
  );
}
