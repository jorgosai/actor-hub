"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONEN = ["Laufend", "Geplant", "Abgeschlossen"];

const STATUS_FARBEN: Record<string, string> = {
  Laufend: "bg-green-100 text-green-800",
  Geplant: "bg-blue-100 text-blue-800",
  Abgeschlossen: "bg-neutral-100 text-neutral-600",
};

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
      <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-300">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium mb-1">Titel</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Meine Rolle</label>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm">
              {STATUS_OPTIONEN.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Startdatum</label>
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Enddatum</label>
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm" />
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
          <h2 className="font-semibold">{title}</h2>
          {role && <p className="text-sm text-neutral-500">Rolle: {role}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_FARBEN[status] ?? "bg-neutral-100"}`}>
            {status}
          </span>
          <button onClick={() => setEditing(true)} className="text-neutral-400 hover:text-neutral-700 transition text-sm" title="Bearbeiten">✎</button>
          <button onClick={handleDelete} className="text-neutral-300 hover:text-red-500 transition text-lg leading-none" title="Löschen">×</button>
        </div>
      </div>
      {(startDate || endDate) && (
        <p className="text-sm text-neutral-500 mt-2">
          {startDate ? new Date(startDate).toLocaleDateString("de-DE") : "?"} –{" "}
          {endDate ? new Date(endDate).toLocaleDateString("de-DE") : "laufend"}
        </p>
      )}
      {notes && <p className="text-sm text-neutral-600 mt-2">{notes}</p>}
    </div>
  );
}
