"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FELD, ICON_KNOPF_LOESCHEN, KARTE, KNOPF_KLEIN, KNOPF_PRIMAER, ROLLE_CHIP, chipTon } from "@/components/stil";
import { X } from "lucide-react";

const STATUS_OPTIONEN = ["In Arbeit", "Gespielt", "Archiv"];

const BEREICHE = [
  { key: "biography", label: "Biografie", frage: "Wer ist die Figur? Herkunft, Alter, Beruf, Prägungen..." },
  { key: "goals", label: "Ziele", frage: "Was will die Figur? Im Stück insgesamt und in einzelnen Szenen?" },
  { key: "obstacles", label: "Hindernisse", frage: "Was steht ihr im Weg? Äußere und innere Konflikte?" },
  { key: "relationships", label: "Beziehungen", frage: "Wie steht sie zu den anderen Figuren?" },
  { key: "subtext", label: "Subtext", frage: "Was denkt und fühlt sie wirklich, während sie etwas anderes sagt?" },
  { key: "notes", label: "Notizen", frage: "Regie-Anmerkungen, Ideen, Referenzen..." },
] as const;

type Rolle = {
  id: string;
  name: string;
  production: string | null;
  status: string;
  biography: string | null;
  goals: string | null;
  obstacles: string | null;
  relationships: string | null;
  subtext: string | null;
  notes: string | null;
};

export default function RolleDetail({ rolle }: { rolle: Rolle }) {
  const router = useRouter();
  const [werte, setWerte] = useState<Record<string, string>>({
    biography: rolle.biography ?? "",
    goals: rolle.goals ?? "",
    obstacles: rolle.obstacles ?? "",
    relationships: rolle.relationships ?? "",
    subtext: rolle.subtext ?? "",
    notes: rolle.notes ?? "",
  });
  const [speichert, setSpeichert] = useState<string | null>(null);
  const [frage, setFrage] = useState("");
  const [antwort, setAntwort] = useState("");
  const [coachLaeuft, setCoachLaeuft] = useState(false);

  async function speichern(key: string) {
    setSpeichert(key);
    await fetch(`/api/rollen/${rolle.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: werte[key] }),
    });
    setSpeichert(null);
    router.refresh();
  }

  async function statusAendern(status: string) {
    await fetch(`/api/rollen/${rolle.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function loeschen() {
    if (!confirm(`Rolle "${rolle.name}" wirklich löschen?`)) return;
    await fetch(`/api/rollen/${rolle.id}`, { method: "DELETE" });
    router.push("/rollen");
  }

  async function coachFragen(text?: string) {
    const f = text ?? frage;
    if (!f.trim()) return;
    setCoachLaeuft(true);
    setAntwort("");
    setFrage("");
    const res = await fetch(`/api/rollen/${rolle.id}/coach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: f }),
    });
    const data = await res.json();
    setAntwort(data.antwort ?? data.error ?? "Etwas ist schiefgelaufen. Bitte nochmal versuchen.");
    setCoachLaeuft(false);
  }

  return (
    <>
      <header className="animate-rise mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Rolle
          </p>
          <h1 className="mt-1.5 text-foreground font-serif text-[calc(2.25rem*var(--serif-skala))] leading-[1.1] sm:text-[calc(3rem*var(--serif-skala))]">
            {rolle.name}
          </h1>
          {rolle.production && (
            <p className="mt-2 text-sm text-muted-foreground">{rolle.production}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <select
            value={rolle.status}
            onChange={(e) => { if (e.isTrusted && e.target.value !== rolle.status) statusAendern(e.target.value); }}
            onWheel={(e) => e.currentTarget.blur()}
            aria-label="Status"
            className={`cursor-pointer appearance-none rounded-full border-0 px-3.5 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-brand/25 ${chipTon(ROLLE_CHIP, rolle.status)}`}
          >
            {STATUS_OPTIONEN.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={loeschen} className={ICON_KNOPF_LOESCHEN} title="Löschen">
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Charakterarbeit */}
        <div className="space-y-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Charakterarbeit</h2>
          {BEREICHE.map((b) => (
            <div key={b.key} className={KARTE}>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {b.label}
              </label>
              <textarea
                value={werte[b.key]}
                onChange={(e) => setWerte({ ...werte, [b.key]: e.target.value })}
                onBlur={() => {
                  const original = (rolle as unknown as Record<string, string | null>)[b.key] ?? "";
                  if (werte[b.key] !== original) speichern(b.key);
                }}
                placeholder={b.frage}
                rows={3}
                className="w-full resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-card-foreground outline-none placeholder:text-muted-foreground/55 focus:ring-0"
              />
              {speichert === b.key && <p className="text-xs text-muted-foreground/80 mt-1">Speichern...</p>}
            </div>
          ))}
          <p className="text-xs text-muted-foreground/80">Änderungen werden automatisch gespeichert.</p>
        </div>

        {/* KI Acting Coach */}
        <div className="lg:sticky lg:top-6">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Acting Coach</h2>
          <div className={KARTE}>
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                { label: "Rolle analysieren", prompt: "Analysiere meine bisherige Charakterarbeit zu dieser Rolle. Was ist stark, wo sind Lücken, welche Fragen sollte ich mir noch stellen?" },
                { label: "Fragen an die Figur", prompt: "Stell mir 5 tiefgehende Fragen zu meiner Figur, die mir helfen, sie besser zu verstehen." },
                { label: "Chubbuck-Ansatz", prompt: "Wie würde ich diese Rolle nach der Chubbuck-Technik aufbauen? Führe mich durch die wichtigsten Schritte." },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => coachFragen(a.prompt)}
                  disabled={coachLaeuft}
                  className={`${KNOPF_KLEIN} disabled:opacity-50`}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={frage}
                onChange={(e) => setFrage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && coachFragen()}
                placeholder="Frag den Coach zu dieser Rolle…"
                className={`${FELD} flex-1`}
              />
              <button
                onClick={() => coachFragen()}
                disabled={coachLaeuft}
                className={KNOPF_PRIMAER}
              >
                {coachLaeuft ? "…" : "Fragen"}
              </button>
            </div>

            {coachLaeuft && (
              <div className="flex items-center gap-2 mt-4">
                <div className="w-2 h-2 bg-muted-foreground/45 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground/45 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-muted-foreground/45 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}

            {antwort && !coachLaeuft && (
              <p className="text-sm whitespace-pre-wrap leading-relaxed mt-4 pt-4 border-t border-border">
                {antwort}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground/80 mt-2">
            Der Coach kennt deine Charakterarbeit — je mehr du links ausfüllst, desto besser seine Antworten.
          </p>
        </div>
      </div>
    </>
  );
}
