"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; label: string };

const TYPEN = ["Casting", "Dreh", "Probe", "Auftritt", "Training", "Meeting", "Sonstiges"];

export default function TerminForm({ castings, projekte }: { castings: Option[]; projekte: Option[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const val = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
    const datum = val("datum");
    const uhrzeit = val("uhrzeit");
    const verknuepfung = val("verknuepfung");
    const data = {
      title: val("title"),
      type: val("type"),
      date: uhrzeit ? `${datum}T${uhrzeit}` : `${datum}T00:00`,
      location: val("location"),
      notes: val("notes"),
      applicationId: verknuepfung.startsWith("app:") ? verknuepfung.slice(4) : null,
      projectId: verknuepfung.startsWith("proj:") ? verknuepfung.slice(5) : null,
    };
    await fetch("/api/termine", {
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
        + Neuer Termin
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Titel *</label>
              <input name="title" required placeholder="z.B. Casting Tatort München" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Datum *</label>
              <input type="date" name="datum" required className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Uhrzeit</label>
              <input type="time" name="uhrzeit" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Art</label>
              <select name="type" defaultValue="Sonstiges" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm">
                {TYPEN.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ort</label>
              <input name="location" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Verknüpfen mit (optional)</label>
              <select name="verknuepfung" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm">
                <option value="">— Keine Verknüpfung —</option>
                {castings.length > 0 && (
                  <optgroup label="Castings">
                    {castings.map((c) => <option key={c.id} value={`app:${c.id}`}>{c.label}</option>)}
                  </optgroup>
                )}
                {projekte.length > 0 && (
                  <optgroup label="Projekte">
                    {projekte.map((p) => <option key={p.id} value={`proj:${p.id}`}>{p.label}</option>)}
                  </optgroup>
                )}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Notizen</label>
              <textarea name="notes" rows={2} className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
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
