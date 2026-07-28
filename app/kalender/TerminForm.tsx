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
        className={KNOPF_PRIMAER}
      >
        <Plus className="h-4 w-4" />
        Neuer Termin
      </button>

      {open && (
        <form onSubmit={handleSubmit} className={`${KARTE} mt-4 flex flex-col gap-5`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={LABEL}>Titel *</label>
              <input name="title" required placeholder="z.B. Casting Tatort München" className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Datum *</label>
              <input type="date" name="datum" required className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Uhrzeit</label>
              <input type="time" name="uhrzeit" className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Art</label>
              <select name="type" defaultValue="Sonstiges" className={FELD}>
                {TYPEN.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Ort</label>
              <input name="location" className={FELD} />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Verknüpfen mit (optional)</label>
              <select name="verknuepfung" className={FELD}>
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
            <div className="sm:col-span-2">
              <label className={LABEL}>Notizen</label>
              <textarea name="notes" rows={2} className={FELD} />
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
