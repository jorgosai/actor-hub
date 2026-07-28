"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FELD, KARTE, KNOPF_PRIMAER, LABEL } from "@/components/stil";
import { Plus } from "lucide-react";

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
        className={KNOPF_PRIMAER}
      >
        <Plus className="h-4 w-4" />
        Neuer Eintrag
      </button>

      {open && (
        <form onSubmit={speichern} className={`${KARTE} mt-4 flex flex-col gap-4`}>
          <div>
            <label className={LABEL}>Anlass *</label>
            <input
              name="title"
              required
              placeholder="z.B. Casting Tatort, Premiere Hamlet, Workshop..."
              className={FELD}
            />
          </div>
          {FELDER.map((f) => (
            <div key={f.key}>
              <label className={LABEL}>{f.label}</label>
              <textarea name={f.key} rows={2} className={FELD} />
            </div>
          ))}
          <button
            type="submit"
            disabled={busy}
            className={KNOPF_PRIMAER}
          >
            {busy ? "Speichern…" : "Speichern"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {eintraege.length === 0 && !open ? (
          <div className="text-muted-foreground text-sm space-y-1">
            <p>Noch keine Einträge.</p>
            <p className="text-muted-foreground/80">
              Nach jedem Casting, Auftritt oder Projekt kurz reflektieren — mit der Zeit erkennst du
              (und der KI-Assistent) Muster in deiner Entwicklung.
            </p>
          </div>
        ) : (
          eintraege.map((e) => (
            <div key={e.id} className={KARTE}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-display text-lg font-semibold tracking-tight text-card-foreground">{e.title}</h2>
                  <p className="text-xs text-muted-foreground/80">
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
                  className="text-muted-foreground/45 hover:text-destructive transition text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2 text-sm">
                {e.wentWell && (
                  <p><span className="text-muted-foreground/80">Lief gut:</span> {e.wentWell}</p>
                )}
                {e.learned && (
                  <p><span className="text-muted-foreground/80">Gelernt:</span> {e.learned}</p>
                )}
                {e.emotions && (
                  <p><span className="text-muted-foreground/80">Gefühl:</span> {e.emotions}</p>
                )}
                {e.notes && <p className="text-muted-foreground">{e.notes}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
