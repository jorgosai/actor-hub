"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, X } from "lucide-react";
import {
  CHIP_KLEIN,
  FELD,
  ICON_KNOPF,
  ICON_KNOPF_LOESCHEN,
  KARTE,
  KATEGORIE_CHIP,
  KNOPF_KLEIN,
  KNOPF_PRIMAER,
  KNOPF_SEKUNDAER,
  LABEL,
  chipTon,
} from "@/components/stil";

const KATEGORIEN = ["Agent", "Casting", "Regisseur", "Produzent", "Kollege", "Sonstiges"];

type Props = {
  id: string;
  name: string;
  category: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  lastContact: Date | null;
};

function tageSeit(d: Date): number {
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
}

export default function KontaktKarte({ id, name, category, company, email, phone, notes, lastContact }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name,
    category,
    company: company ?? "",
    email: email ?? "",
    phone: phone ?? "",
    notes: notes ?? "",
    lastContact: lastContact ? new Date(lastContact).toISOString().split("T")[0] : "",
  });

  const tage = lastContact ? tageSeit(lastContact) : null;
  const lange = tage !== null && tage >= 90;

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/kontakte/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setEditing(false);
    router.refresh();
  }

  async function handleTouch() {
    await fetch(`/api/kontakte/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ touchLastContact: true }),
    });
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Kontakt "${name}" wirklich löschen?`)) return;
    await fetch(`/api/kontakte/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (editing) {
    return (
      <div className={KARTE}>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Kategorie</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={FELD}>
              {KATEGORIEN.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>E-Mail</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Telefon</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Agentur / Firma</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Letzter Kontakt</label>
            <input type="date" value={form.lastContact} onChange={(e) => setForm({ ...form, lastContact: e.target.value })} className={FELD} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Notizen</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className={FELD} />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={loading} className={KNOPF_PRIMAER}>
            {loading ? "Speichern…" : "Speichern"}
          </button>
          <button onClick={() => setEditing(false)} className={KNOPF_SEKUNDAER}>
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${KARTE} ${lange ? "ring-1 ring-destructive/20" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold tracking-tight text-card-foreground">
            {name}
          </h2>
          {company && <p className="text-sm text-muted-foreground">{company}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={`${CHIP_KLEIN} ${chipTon(KATEGORIE_CHIP, category)}`}>{category}</span>
          <button onClick={() => setEditing(true)} className={ICON_KNOPF} title="Bearbeiten">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={handleDelete} className={ICON_KNOPF_LOESCHEN} title="Löschen">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {(email || phone) && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className={`text-xs ${lange ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
          {tage === null
            ? "Noch nie kontaktiert"
            : tage === 0
            ? "Heute kontaktiert"
            : `Letzter Kontakt vor ${tage} ${tage === 1 ? "Tag" : "Tagen"}`}
        </span>
        <button onClick={handleTouch} className={KNOPF_KLEIN}>
          <Check className="h-3 w-3" />
          Heute kontaktiert
        </button>
      </div>

      {notes && <p className="mt-3 text-sm text-muted-foreground">{notes}</p>}
    </div>
  );
}
