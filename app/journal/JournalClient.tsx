"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Eintrag = {
  id: string;
  title: string;
  wentWell: string | null;
  learned: string | null;
  emotions: string | null;
  notes: string | null;
  createdAt: Date;
};

const FELDER = [
  { key: "wentWell", label: "Was lief gut?" },
  { key: "learned", label: "Was habe ich gelernt?" },
  { key: "emotions", label: "Wie ging es mir dabei?" },
  { key: "notes", label: "Sonstiges" },
] as const;

export default function JournalClient({ eintraege }: { eintraege: Eintrag[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function speichern(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    const val = (n: string) =>
      (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement).value;
    await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: val("title"),
        wentWell: val("wentWell"),
        learned: val("learned"),
        emotions: val("emotions"),
        notes: val("notes"),
      }),
    });
    setBusy(false);
    setOpen(false);
    router.refresh();
  }

  async function loeschen(id: string, title: string) {
    if (!confirm(`Eintrag "${title}" wirklich löschen?`)) return;
    await fetch(`/api/journal/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700 transition"
      >
        + Neuer Eintrag
      </button>

      {open && (
        <form onSubmit={speichern} className="mt-4 bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Anlass *</label>
            <input
              name="title"
              required
              placeholder="z.B. Casting Tatort, Premiere Hamlet, Workshop..."
              className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
            />
          </div>
          {FELDER.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              <textarea name={f.key} rows={2} className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
          ))}
          <button
            type="submit"
            disabled={busy}
            className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700 transition disabled:opacity-50"
          >
            {busy ? "Speichern..." : "Speichern"}
          </button>
        </form>
      )}

      <div className="mt-8 space-y-4">
        {eintraege.length === 0 && !open ? (
          <div className="text-neutral-500 text-sm space-y-1">
            <p>Noch keine Einträge.</p>
            <p className="text-neutral-400">
              Nach jedem Casting, Auftritt oder Projekt kurz reflektieren — mit der Zeit erkennst du
              (und der KI-Assistent) Muster in deiner Entwicklung.
            </p>
          </div>
        ) : (
          eintraege.map((e) => (
            <div key={e.id} className="bg-white border border-neutral-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-semibold">{e.title}</h2>
                  <p className="text-xs text-neutral-400">
                    {new Date(e.createdAt).toLocaleDateString("de-DE", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => loeschen(e.id, e.title)}
                  className="text-neutral-300 hover:text-red-500 transition text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2 text-sm">
                {e.wentWell && (
                  <p><span className="text-neutral-400">Lief gut:</span> {e.wentWell}</p>
                )}
                {e.learned && (
                  <p><span className="text-neutral-400">Gelernt:</span> {e.learned}</p>
                )}
                {e.emotions && (
                  <p><span className="text-neutral-400">Gefühl:</span> {e.emotions}</p>
                )}
                {e.notes && <p className="text-neutral-600">{e.notes}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
