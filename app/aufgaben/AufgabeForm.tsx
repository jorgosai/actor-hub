"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; label: string };

export default function AufgabeForm({ castings, projekte }: { castings: Option[]; projekte: Option[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const val = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement).value;
    const verknuepfung = val("verknuepfung"); // "" | "app:<id>" | "proj:<id>"
    const data = {
      title: val("title"),
      priority: val("priority"),
      dueDate: val("dueDate") || null,
      applicationId: verknuepfung.startsWith("app:") ? verknuepfung.slice(4) : null,
      projectId: verknuepfung.startsWith("proj:") ? verknuepfung.slice(5) : null,
    };
    await fetch("/api/aufgaben", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700 transition"
      >
        + Neue Aufgabe
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Aufgabe *</label>
              <input name="title" required placeholder="z.B. Self Tape für Tatort aufnehmen" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fällig am</label>
              <input type="date" name="dueDate" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priorität</label>
              <select name="priority" defaultValue="Normal" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm">
                <option value="Hoch">Hoch</option>
                <option value="Normal">Normal</option>
                <option value="Niedrig">Niedrig</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Verknüpfen mit (optional)</label>
              <select name="verknuepfung" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm">
                <option value="">— Keine Verknüpfung —</option>
                {castings.length > 0 && (
                  <optgroup label="Castings">
                    {castings.map((c) => (
                      <option key={c.id} value={`app:${c.id}`}>{c.label}</option>
                    ))}
                  </optgroup>
                )}
                {projekte.length > 0 && (
                  <optgroup label="Projekte">
                    {projekte.map((p) => (
                      <option key={p.id} value={`proj:${p.id}`}>{p.label}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700 transition disabled:opacity-50"
          >
            {loading ? "Speichern..." : "Speichern"}
          </button>
        </form>
      )}
    </div>
  );
}
