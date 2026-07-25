"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HORIZONTE = ["Kurzfristig", "Mittelfristig", "Langfristig"];
const WUNSCH_TYPEN = ["Rolle", "Produktion", "Regisseur", "Agentur"];

type Goal = {
  id: string;
  title: string;
  horizon: string;
  done: boolean;
  targetDate: Date | null;
  notes: string | null;
};

type Wish = {
  id: string;
  title: string;
  type: string;
  achieved: boolean;
  notes: string | null;
};

export default function KarriereClient({ ziele, wuensche }: { ziele: Goal[]; wuensche: Wish[] }) {
  const router = useRouter();
  const [zielOpen, setZielOpen] = useState(false);
  const [wunschOpen, setWunschOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitZiel(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement).value;
    await fetch("/api/ziele", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: val("title"),
        horizon: val("horizon"),
        targetDate: val("targetDate") || null,
        notes: val("notes"),
      }),
    });
    setLoading(false);
    setZielOpen(false);
    router.refresh();
  }

  async function submitWunsch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement).value;
    await fetch("/api/ziele", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        art: "wish",
        title: val("title"),
        type: val("type"),
        notes: val("notes"),
      }),
    });
    setLoading(false);
    setWunschOpen(false);
    router.refresh();
  }

  async function toggleZiel(id: string, done: boolean) {
    await fetch(`/api/ziele/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !done }),
    });
    router.refresh();
  }

  async function toggleWunsch(id: string, achieved: boolean) {
    await fetch(`/api/ziele/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ art: "wish", achieved: !achieved }),
    });
    router.refresh();
  }

  async function deleteZiel(id: string) {
    await fetch(`/api/ziele/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function deleteWunsch(id: string) {
    await fetch(`/api/ziele/${id}?art=wish`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-12">
      {/* Ziele */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Ziele</h2>
          <button
            onClick={() => setZielOpen(!zielOpen)}
            className="bg-neutral-900 text-white px-3 py-1.5 rounded text-sm hover:bg-neutral-700 transition"
          >
            + Neues Ziel
          </button>
        </div>

        {zielOpen && (
          <form onSubmit={submitZiel} className="mb-6 bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1">Ziel *</label>
                <input name="title" required placeholder="z.B. Hauptrolle in einer TV-Serie" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Horizont</label>
                <select name="horizon" defaultValue="Mittelfristig" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm">
                  {HORIZONTE.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Zieldatum (optional)</label>
                <input type="date" name="targetDate" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1">Notizen</label>
                <input name="notes" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="bg-neutral-900 text-white px-4 py-2 rounded text-sm hover:bg-neutral-700 transition disabled:opacity-50">
              {loading ? "Speichern..." : "Speichern"}
            </button>
          </form>
        )}

        <div className="space-y-6">
          {HORIZONTE.map((h) => {
            const liste = ziele.filter((z) => z.horizon === h);
            if (liste.length === 0) return null;
            return (
              <div key={h}>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">{h}</p>
                <div className="space-y-2">
                  {liste.map((z) => (
                    <div key={z.id} className="bg-white rounded-lg px-4 py-3 shadow-sm border border-neutral-200 flex items-center gap-3">
                      <button
                        onClick={() => toggleZiel(z.id, z.done)}
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                          z.done ? "bg-green-600 border-green-600 text-white" : "border-neutral-300 hover:border-neutral-500"
                        }`}
                      >
                        {z.done && <span className="text-xs leading-none">✓</span>}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm ${z.done ? "line-through text-neutral-400" : "text-neutral-900"}`}>{z.title}</p>
                        {z.notes && <p className="text-xs text-neutral-400 mt-0.5">{z.notes}</p>}
                      </div>
                      {z.targetDate && (
                        <span className="text-xs text-neutral-400 whitespace-nowrap">
                          bis {new Date(z.targetDate).toLocaleDateString("de-DE", { month: "short", year: "numeric" })}
                        </span>
                      )}
                      <button onClick={() => deleteZiel(z.id)} className="text-neutral-300 hover:text-red-500 transition text-lg leading-none">×</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {ziele.length === 0 && <p className="text-sm text-neutral-500">Noch keine Ziele definiert.</p>}
        </div>
      </section>

      {/* Wunschliste */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Wunschliste</h2>
          <button
            onClick={() => setWunschOpen(!wunschOpen)}
            className="bg-neutral-900 text-white px-3 py-1.5 rounded text-sm hover:bg-neutral-700 transition"
          >
            + Neuer Wunsch
          </button>
        </div>

        {wunschOpen && (
          <form onSubmit={submitWunsch} className="mb-6 bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Wunsch *</label>
                <input name="title" required placeholder="z.B. Hamlet spielen" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Art</label>
                <select name="type" defaultValue="Rolle" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm">
                  {WUNSCH_TYPEN.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1">Notizen</label>
                <input name="notes" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="bg-neutral-900 text-white px-4 py-2 rounded text-sm hover:bg-neutral-700 transition disabled:opacity-50">
              {loading ? "Speichern..." : "Speichern"}
            </button>
          </form>
        )}

        <div className="space-y-6">
          {WUNSCH_TYPEN.map((typ) => {
            const liste = wuensche.filter((w) => w.type === typ);
            if (liste.length === 0) return null;
            return (
              <div key={typ}>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">
                  {typ === "Rolle" ? "Wunschrollen" : typ === "Produktion" ? "Wunschproduktionen" : typ === "Regisseur" ? "Wunschregisseure" : "Wunschagenturen"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {liste.map((w) => (
                    <div
                      key={w.id}
                      className={`group flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${
                        w.achieved
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-white border-neutral-200 text-neutral-700"
                      }`}
                    >
                      <button onClick={() => toggleWunsch(w.id, w.achieved)} title={w.achieved ? "Als offen markieren" : "Als erreicht markieren"}>
                        {w.achieved ? "★" : "☆"}
                      </button>
                      <span className={w.achieved ? "line-through" : ""}>{w.title}</span>
                      <button
                        onClick={() => deleteWunsch(w.id)}
                        className="text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {wuensche.length === 0 && <p className="text-sm text-neutral-500">Noch keine Wünsche eingetragen.</p>}
        </div>
      </section>
    </div>
  );
}
