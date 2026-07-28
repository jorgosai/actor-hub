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

const TYPEN = ["Showreel", "Headshot", "Vita", "Voice Demo", "Self Tape", "Presse", "Sonstiges"];

export default function MaterialForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const val = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
    const data = {
      name: val("name"),
      type: val("type"),
      url: val("url"),
      version: val("version"),
      current: (form.elements.namedItem("current") as HTMLInputElement).checked,
      notes: val("notes"),
    };
    await fetch("/api/material", {
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
        Neues Material
      </button>

      {open && (
        <form onSubmit={handleSubmit} className={`${KARTE} mt-4 flex flex-col gap-5`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Name *</label>
              <input name="name" required placeholder="z.B. Showreel 2026" className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Art</label>
              <select name="type" defaultValue="Showreel" className={FELD}>
                {TYPEN.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Link (YouTube, Vimeo, Google Drive, Dropbox...)</label>
              <input name="url" type="url" placeholder="https://..." className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Version</label>
              <input name="version" placeholder="z.B. 2026 oder V2" className={FELD} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="current" defaultChecked className="w-4 h-4" />
                Aktuelle Version
              </label>
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
