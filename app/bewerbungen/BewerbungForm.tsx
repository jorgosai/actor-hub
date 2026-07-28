"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { FELD, KARTE, KNOPF_PRIMAER, LABEL } from "@/components/stil";

type Kontakt = { id: string; name: string; category: string };

const STATUS_OPTIONEN = ["Anfrage", "Beworben", "Self Tape", "Recall", "Callback", "Gebucht", "Abgesagt"];

export default function BewerbungForm({ kontakte }: { kontakte: Kontakt[] }) {
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
      role: val("role"),
      production: val("production"),
      status: val("status"),
      notes: val("notes"),
      contactId: val("contactId") || null,
      deadline: val("deadline") || null,
      followUpAt: val("followUpAt") || null,
    };
    await fetch("/api/bewerbungen", {
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
      <button onClick={() => setOpen(!open)} className={KNOPF_PRIMAER}>
        {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {open ? "Abbrechen" : "Neues Casting"}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className={`${KARTE} mt-4 flex flex-col gap-5`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Rolle *</label>
              <input name="role" required className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Produktion *</label>
              <input name="production" required className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Status</label>
              <select name="status" defaultValue="Beworben" className={FELD}>
                {STATUS_OPTIONEN.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Kontakt (optional)</label>
              <select name="contactId" className={FELD}>
                <option value="">— Kein Kontakt —</option>
                {kontakte.map((k) => (
                  <option key={k.id} value={k.id}>{k.name} ({k.category})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Deadline (z.B. Self Tape Abgabe)</label>
              <input type="date" name="deadline" className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Follow-up am</label>
              <input type="date" name="followUpAt" className={FELD} />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Notizen</label>
              <textarea name="notes" rows={3} className={FELD} />
            </div>
          </div>
          <button type="submit" disabled={loading} className={`${KNOPF_PRIMAER} self-start`}>
            {loading ? "Speichern…" : "Speichern"}
          </button>
        </form>
      )}
    </div>
  );
}
