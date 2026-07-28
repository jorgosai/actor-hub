"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";
import {
  CHIP_KLEIN,
  CHIP_LEISE,
  CHIP_WARNUNG,
  FELD,
  ICON_KNOPF,
  ICON_KNOPF_LOESCHEN,
  KARTE,
  KNOPF_PRIMAER,
  KNOPF_SEKUNDAER,
  LABEL,
  STATUS_CHIP,
  chipTon,
} from "@/components/stil";

const STATUS_OPTIONEN = ["Anfrage", "Beworben", "Self Tape", "Recall", "Callback", "Gebucht", "Abgesagt"];

type Kontakt = { id: string; name: string; category: string };

type Props = {
  id: string;
  role: string;
  production: string;
  status: string;
  notes: string | null;
  followUpAt: Date | null;
  deadline: Date | null;
  contactName?: string | null;
  contactId?: string | null;
  kontakte: Kontakt[];
};

function toInputDate(d: Date | null): string {
  return d ? new Date(d).toISOString().split("T")[0] : "";
}

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

export default function BewerbungKarte({ id, role, production, status, notes, followUpAt, deadline, contactName, contactId, kontakte }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role,
    production,
    notes: notes ?? "",
    contactId: contactId ?? "",
    followUpAt: toInputDate(followUpAt),
    deadline: toInputDate(deadline),
  });

  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  const aktiv = status !== "Gebucht" && status !== "Abgesagt";
  const followUpFaellig = aktiv && followUpAt && new Date(followUpAt) <= heute;
  const deadlineNah = aktiv && deadline && (new Date(deadline).getTime() - heute.getTime()) / 86400000 <= 3;

  async function handleStatusChange(neuerStatus: string, echt: boolean) {
    /* Schutz gegen versehentliche Änderungen: nur bei echter Nutzereingabe
       und nur, wenn sich der Wert tatsächlich unterscheidet. */
    if (!echt || neuerStatus === status) return;
    await fetch(`/api/bewerbungen/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: neuerStatus }),
    });
    router.refresh();
  }

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/bewerbungen/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Bewerbung "${role}" wirklich löschen?`)) return;
    await fetch(`/api/bewerbungen/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (editing) {
    return (
      <div className={KARTE}>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Rolle</label>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Produktion</label>
            <input value={form.production} onChange={(e) => setForm({ ...form, production: e.target.value })} className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Deadline (z.B. Self Tape Abgabe)</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Follow-up am</label>
            <input type="date" value={form.followUpAt} onChange={(e) => setForm({ ...form, followUpAt: e.target.value })} className={FELD} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Kontakt</label>
            <select value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} className={FELD}>
              <option value="">— Kein Kontakt —</option>
              {kontakte.map((k) => <option key={k.id} value={k.id}>{k.name} ({k.category})</option>)}
            </select>
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
            {role}
          </h2>
          <p className="text-sm text-muted-foreground">{production}</p>
          {contactName && (
            <p className="mt-0.5 text-xs text-muted-foreground/80">via {contactName}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value, e.isTrusted)}
            onWheel={(e) => e.currentTarget.blur()}
            aria-label="Status"
            className={`cursor-pointer appearance-none rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-brand/25 ${chipTon(STATUS_CHIP, status)}`}
          >
            {STATUS_OPTIONEN.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={() => setEditing(true)} className={ICON_KNOPF} title="Bearbeiten">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={handleDelete} className={ICON_KNOPF_LOESCHEN} title="Löschen">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {(deadline || followUpAt) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {deadline && (
            <span className={`${CHIP_KLEIN} ${deadlineNah ? CHIP_WARNUNG : CHIP_LEISE}`}>
              Deadline: {formatDate(deadline)}
            </span>
          )}
          {followUpAt && (
            <span className={`${CHIP_KLEIN} ${followUpFaellig ? CHIP_WARNUNG : CHIP_LEISE}`}>
              Follow-up: {formatDate(followUpAt)}{followUpFaellig ? " — fällig" : ""}
            </span>
          )}
        </div>
      )}

      {notes && <p className="mt-3 text-sm text-muted-foreground">{notes}</p>}
    </div>
  );
}
