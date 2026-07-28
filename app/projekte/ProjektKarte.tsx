"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";
import {
  CHIP,
  FELD,
  ICON_KNOPF,
  ICON_KNOPF_LOESCHEN,
  KARTE,
  KNOPF_PRIMAER,
  KNOPF_SEKUNDAER,
  LABEL,
  PROJEKT_CHIP,
  chipTon,
} from "@/components/stil";

const STATUS_OPTIONEN = ["Laufend", "Geplant", "Abgeschlossen"];

type Props = {
  id: string;
  title: string;
  role: string | null;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  notes: string | null;
};

export default function ProjektKarte({ id, title, role, status, startDate, endDate, notes }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title,
    role: role ?? "",
    status,
    startDate: startDate ? new Date(startDate).toISOString().split("T")[0] : "",
    endDate: endDate ? new Date(endDate).toISOString().split("T")[0] : "",
    notes: notes ?? "",
  });

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/projekte/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Projekt "${title}" wirklich löschen?`)) return;
    await fetch(`/api/projekte/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (editing) {
    return (
      <div className={KARTE}>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Titel</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Meine Rolle</label>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={FELD}>
              {STATUS_OPTIONEN.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Startdatum</label>
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Enddatum</label>
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={FELD} />
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
    <div className={KARTE}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold tracking-tight text-card-foreground">
            {title}
          </h2>
          {role && <p className="text-sm text-muted-foreground">Rolle: {role}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={`${CHIP} ${chipTon(PROJEKT_CHIP, status)}`}>{status}</span>
          <button onClick={() => setEditing(true)} className={ICON_KNOPF} title="Bearbeiten">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={handleDelete} className={ICON_KNOPF_LOESCHEN} title="Löschen">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {(startDate || endDate) && (
        <p className="mt-2 text-sm text-muted-foreground">
          {startDate ? new Date(startDate).toLocaleDateString("de-DE") : "?"} –{" "}
          {endDate ? new Date(endDate).toLocaleDateString("de-DE") : "laufend"}
        </p>
      )}
      {notes && <p className="text-sm text-muted-foreground mt-2">{notes}</p>}
    </div>
  );
}
