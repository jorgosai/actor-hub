"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700 transition"
      >
        + Neues Projekt
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titel *</label>
              <input name="title" required className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meine Rolle</label>
              <input name="role" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm">
                {STATUS_OPTIONEN.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Startdatum</label>
              <input name="startDate" type="date" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Enddatum</label>
              <input name="endDate" type="date" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Notizen</label>
              <textarea name="notes" rows={3} className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
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
