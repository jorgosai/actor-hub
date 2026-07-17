"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const KATEGORIEN = ["Agent", "Casting", "Regisseur", "Produzent", "Kollege", "Sonstiges"];

const KATEGORIE_FARBEN: Record<string, string> = {
  Agent: "bg-blue-100 text-blue-800",
  Casting: "bg-purple-100 text-purple-800",
  Regisseur: "bg-yellow-100 text-yellow-800",
  Produzent: "bg-orange-100 text-orange-800",
  Kollege: "bg-green-100 text-green-800",
  Sonstiges: "bg-neutral-100 text-neutral-800",
};

type Props = {
  id: string;
  name: string;
  category: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
};

export default function KontaktKarte({ id, name, category, company, email, phone, notes }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name, category, company: company ?? "", email: email ?? "", phone: phone ?? "", notes: notes ?? "" });

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

  async function handleDelete() {
    if (!confirm(`Kontakt "${name}" wirklich löschen?`)) return;
    await fetch(`/api/kontakte/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (editing) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-300">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium mb-1">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Kategorie</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm">
              {KATEGORIEN.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">E-Mail</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Telefon</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1">Agentur / Firma</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full border border-neutral-300 rounded px-3 py-1.5 text-sm" />
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
          <h2 className="font-semibold">{name}</h2>
          {company && <p className="text-sm text-neutral-500">{company}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${KATEGORIE_FARBEN[category] ?? "bg-neutral-100"}`}>
            {category}
          </span>
          <button onClick={() => setEditing(true)} className="text-neutral-400 hover:text-neutral-700 transition text-sm" title="Bearbeiten">✎</button>
          <button onClick={handleDelete} className="text-neutral-300 hover:text-red-500 transition text-lg leading-none" title="Löschen">×</button>
        </div>
      </div>
      <div className="mt-2 flex gap-4 text-sm text-neutral-500">
        {email && <span>{email}</span>}
        {phone && <span>{phone}</span>}
      </div>
      {notes && <p className="text-sm text-neutral-600 mt-2">{notes}</p>}
    </div>
  );
}
