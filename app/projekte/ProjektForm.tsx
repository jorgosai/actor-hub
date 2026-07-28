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

const STATUS_OPTIONEN = ["Laufend", "Geplant", "Abgeschlossen"];

export default function ProjektForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      role: (form.elements.namedItem("role") as HTMLInputElement).value,
      status: (form.elements.namedItem("status") as HTMLSelectElement).value,
      startDate: (form.elements.namedItem("startDate") as HTMLInputElement).value,
      endDate: (form.elements.namedItem("endDate") as HTMLInputElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
    };
    await fetch("/api/projekte", {
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
        Neues Projekt
      </button>

      {open && (
        <form onSubmit={handleSubmit} className={`${KARTE} mt-4 flex flex-col gap-5`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Titel *</label>
              <input name="title" required className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Meine Rolle</label>
              <input name="role" className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Status</label>
              <select name="status" className={FELD}>
                {STATUS_OPTIONEN.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Startdatum</label>
              <input name="startDate" type="date" className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Enddatum</label>
              <input name="endDate" type="date" className={FELD} />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Notizen</label>
              <textarea name="notes" rows={3} className={FELD} />
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
