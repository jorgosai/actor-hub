"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRIO_FARBEN: Record<string, string> = {
  Hoch: "bg-red-100 text-red-700",
  Normal: "bg-neutral-100 text-neutral-600",
  Niedrig: "bg-neutral-50 text-neutral-400",
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
    <div className={`bg-white rounded-lg px-4 py-3 shadow-sm border flex items-center gap-3 ${ueberfaellig ? "border-red-200" : "border-neutral-200"}`}>
      <button
        onClick={toggle}
        disabled={busy}
        className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition ${
          done ? "bg-neutral-900 border-neutral-900 text-white" : "border-neutral-300 hover:border-neutral-500"
        }`}
        title={done ? "Als offen markieren" : "Als erledigt markieren"}
      >
        {done && <span className="text-xs leading-none">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${done ? "line-through text-neutral-400" : "text-neutral-900"}`}>{title}</p>
        {verknuepfung && <p className="text-xs text-neutral-400 mt-0.5">{verknuepfung}</p>}
      </div>

      {dueDate && (
        <span className={`text-xs whitespace-nowrap ${ueberfaellig ? "text-red-600 font-medium" : "text-neutral-400"}`}>
          {new Date(dueDate).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
          {ueberfaellig ? " — überfällig" : ""}
        </span>
      )}

      {priority !== "Normal" && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${PRIO_FARBEN[priority]}`}>
          {priority}
        </span>
      )}

      <button onClick={handleDelete} className="text-neutral-300 hover:text-red-500 transition text-lg leading-none" title="Löschen">×</button>
    </div>
  );
}
