"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FELD,
  KARTE,
  KNOPF_PRIMAER,
  LABEL,
} from "@/components/stil";
import { Plus } from "lucide-react";

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
        className={KNOPF_PRIMAER}
      >
        <Plus className="h-4 w-4" />
        Neue Aufgabe
      </button>

      {open && (
        <form onSubmit={handleSubmit} className={`${KARTE} mt-4 flex flex-col gap-5`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={LABEL}>Aufgabe *</label>
              <input name="title" required placeholder="z.B. Self Tape für Tatort aufnehmen" className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Fällig am</label>
              <input type="date" name="dueDate" className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Priorität</label>
              <select name="priority" defaultValue="Normal" className={FELD}>
                <option value="Hoch">Hoch</option>
                <option value="Normal">Normal</option>
                <option value="Niedrig">Niedrig</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Verknüpfen mit (optional)</label>
              <select name="verknuepfung" className={FELD}>
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
            className={KNOPF_PRIMAER}
          >
            {loading ? "Speichern…" : "Speichern"}
          </button>
        </form>
      )}
    </div>
  );
}
