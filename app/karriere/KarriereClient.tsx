"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FELD,
  HAKEN_AN,
  HAKEN_AUS,
  ICON_KNOPF_LOESCHEN,
  KARTE,
  KNOPF_PRIMAER,
  LABEL,
  ZEILEN,
} from "@/components/stil";
import { Check, Plus, X } from "lucide-react";

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
          <h2 className="font-serif text-[calc(1.6rem*var(--serif-skala))] leading-tight text-foreground">Ziele</h2>
          <button
            onClick={() => setZielOpen(!zielOpen)}
            className={KNOPF_PRIMAER}
          >
            <Plus className="h-4 w-4" />
            Neues Ziel
          </button>
        </div>

        {zielOpen && (
          <form onSubmit={submitZiel} className={`${KARTE} mb-6 flex flex-col gap-4`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={LABEL}>Ziel *</label>
                <input name="title" required placeholder="z.B. Hauptrolle in einer TV-Serie" className={FELD} />
              </div>
              <div>
                <label className={LABEL}>Horizont</label>
                <select name="horizon" defaultValue="Mittelfristig" className={FELD}>
                  {HORIZONTE.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Zieldatum (optional)</label>
                <input type="date" name="targetDate" className={FELD} />
              </div>
              <div className="sm:col-span-2">
                <label className={LABEL}>Notizen</label>
                <input name="notes" className={FELD} />
              </div>
            </div>
            <button type="submit" disabled={loading} className={KNOPF_PRIMAER}>
              {loading ? "Speichern…" : "Speichern"}
            </button>
          </form>
        )}

        <div className="space-y-6">
          {HORIZONTE.map((h) => {
            const liste = ziele.filter((z) => z.horizon === h);
            if (liste.length === 0) return null;
            return (
              <div key={h}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">{h}</p>
                <div className={`${KARTE} ${ZEILEN} py-1`}>
                  {liste.map((z) => (
                    <div key={z.id} className="flex items-center gap-3 px-1 py-3.5">
                      <button
                        onClick={() => toggleZiel(z.id, z.done)}
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                          z.done ? HAKEN_AN : HAKEN_AUS
                        }`}
                      >
                        {z.done && <Check className="h-3 w-3" strokeWidth={3} />}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm ${z.done ? "line-through text-muted-foreground/80" : "text-foreground"}`}>{z.title}</p>
                        {z.notes && <p className="text-xs text-muted-foreground/80 mt-0.5">{z.notes}</p>}
                      </div>
                      {z.targetDate && (
                        <span className="text-xs text-muted-foreground/80 whitespace-nowrap">
                          bis {new Date(z.targetDate).toLocaleDateString("de-DE", { month: "short", year: "numeric" })}
                        </span>
                      )}
                      <button onClick={() => deleteZiel(z.id)} className={ICON_KNOPF_LOESCHEN} title="Löschen">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {ziele.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Ziele definiert.</p>}
        </div>
      </section>

      {/* Wunschliste */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-[calc(1.6rem*var(--serif-skala))] leading-tight text-foreground">Wunschliste</h2>
          <button
            onClick={() => setWunschOpen(!wunschOpen)}
            className={KNOPF_PRIMAER}
          >
            <Plus className="h-4 w-4" />
            Neuer Wunsch
          </button>
        </div>

        {wunschOpen && (
          <form onSubmit={submitWunsch} className={`${KARTE} mb-6 flex flex-col gap-4`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Wunsch *</label>
                <input name="title" required placeholder="z.B. Hamlet spielen" className={FELD} />
              </div>
              <div>
                <label className={LABEL}>Art</label>
                <select name="type" defaultValue="Rolle" className={FELD}>
                  {WUNSCH_TYPEN.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={LABEL}>Notizen</label>
                <input name="notes" className={FELD} />
              </div>
            </div>
            <button type="submit" disabled={loading} className={KNOPF_PRIMAER}>
              {loading ? "Speichern…" : "Speichern"}
            </button>
          </form>
        )}

        <div className="space-y-6">
          {WUNSCH_TYPEN.map((typ) => {
            const liste = wuensche.filter((w) => w.type === typ);
            if (liste.length === 0) return null;
            return (
              <div key={typ}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2">
                  {typ === "Rolle" ? "Wunschrollen" : typ === "Produktion" ? "Wunschproduktionen" : typ === "Regisseur" ? "Wunschregisseure" : "Wunschagenturen"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {liste.map((w) => (
                    <div
                      key={w.id}
                      className={`group flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${
                        w.achieved
                          ? "border-brand/25 bg-brand/8 text-brand"
                          : "bg-card border-border text-foreground"
                      }`}
                    >
                      <button onClick={() => toggleWunsch(w.id, w.achieved)} title={w.achieved ? "Als offen markieren" : "Als erreicht markieren"}>
                        {w.achieved ? "★" : "☆"}
                      </button>
                      <span className={w.achieved ? "line-through" : ""}>{w.title}</span>
                      <button
                        onClick={() => deleteWunsch(w.id)}
                        className="text-muted-foreground/45 hover:text-destructive opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {wuensche.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Wünsche eingetragen.</p>}
        </div>
      </section>
    </div>
  );
}
