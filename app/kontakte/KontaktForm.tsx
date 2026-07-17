"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const KATEGORIEN = ["Agent", "Casting", "Regisseur", "Produzent", "Kollege", "Sonstiges"];

export default function KontaktForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      category: (form.elements.namedItem("category") as HTMLSelectElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
    };
    await fetch("/api/kontakte", {
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
        + Neuer Kontakt
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input name="name" required className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kategorie *</label>
              <select name="category" required className="w-full border border-neutral-300 rounded px-3 py-2 text-sm">
                {KATEGORIEN.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-Mail</label>
              <input name="email" type="email" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefon</label>
              <input name="phone" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Agentur / Firma</label>
              <input name="company" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
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
