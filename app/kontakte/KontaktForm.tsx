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
        className={KNOPF_PRIMAER}
      >
        <Plus className="h-4 w-4" />
        Neuer Kontakt
      </button>

      {open && (
        <form onSubmit={handleSubmit} className={`${KARTE} mt-4 flex flex-col gap-5`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Name *</label>
              <input name="name" required className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Kategorie *</label>
              <select name="category" required className={FELD}>
                {KATEGORIEN.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>E-Mail</label>
              <input name="email" type="email" className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Telefon</label>
              <input name="phone" className={FELD} />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Agentur / Firma</label>
              <input name="company" className={FELD} />
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
