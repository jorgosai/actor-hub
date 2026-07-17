"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONEN = ["Beworben", "Eingeladen", "Callback", "Angenommen", "Abgesagt"];

const STATUS_FARBEN: Record<string, string> = {
  Beworben: "bg-blue-100 text-blue-800",
  Eingeladen: "bg-yellow-100 text-yellow-800",
  Callback: "bg-purple-100 text-purple-800",
  Angenommen: "bg-green-100 text-green-800",
  Abgesagt: "bg-red-100 text-red-800",
};

type Kontakt = { id: string; name: string; category: string };

type Props = {
  id: string;
  role: string;
  production: string;
  status: string;
  notes: string | null;
  contactName?: string | null;
  contactId?: string | null;
  kontakte: Kontakt[];
};

export default function BewerbungKarte({ id, role, production, status, notes, contactName, contactId, kontakte }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ role, production, notes: notes ?? "", contactId: contactId ?? "" });

  async function handleStatusChange(neuerStatus: string) {
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
      <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-300">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium mb-1">Rolle</label>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Produktion</label>
            <input value={form.production} onChange={(e) => setForm({ ...form, production: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1">Kontakt</label>
            <select value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm">
              <option value="">— Kein Kontakt —</option>
              {kontakte.map((k) => <option key={k.id} value={k.id}>{k.name} ({k.category})</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1">Notizen</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={loading} className="bg-neutral-900 text-white px-3 py-1.5 rounded text-sm hover:bg-neutral-700 transition disabled:opacity-50">
            {loading ? "Speichern..." : "Speichern"}
          </button>
          <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded text-sm border border-neutral-300 hover:bg-neutral-50 transition">
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{role}</h2>
          <p className="text-sm text-neutral-500">{production}</p>
          {contactName && <p className="text-xs text-neutral-400 mt-0.5">via {contactName}</p>}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`text-xs px-3 py-1 rounded-full border-0 font-medium cursor-pointer ${STATUS_FARBEN[status] ?? "bg-neutral-100"}`}
          >
            {STATUS_OPTIONEN.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={() => setEditing(true)} className="text-neutral-400 hover:text-neutral-700 transition text-sm" title="Bearbeiten">✎</button>
          <button onClick={handleDelete} className="text-neutral-300 hover:text-red-500 transition text-lg leading-none" title="Löschen">×</button>
        </div>
      </div>
      {notes && <p className="text-sm text-neutral-600 mt-2">{notes}</p>}
    </div>
  );
}
