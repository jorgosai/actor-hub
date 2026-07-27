"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="mt-4">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight">{rolle.name}</h1>
          {rolle.production && <p className="text-neutral-500 mt-1">{rolle.production}</p>}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={rolle.status}
            onChange={(e) => statusAendern(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-full border border-neutral-300 font-medium cursor-pointer bg-white"
          >
            {STATUS_OPTIONEN.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={loeschen} className="text-neutral-300 hover:text-red-500 transition text-lg" title="Löschen">×</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Charakterarbeit */}
        <div className="space-y-5">
          <h2 className="text-sm font-semibold">Charakterarbeit</h2>
          {BEREICHE.map((b) => (
            <div key={b.key} className="bg-white border border-neutral-200 rounded-xl p-4">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">
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
                className="w-full text-sm border-0 p-0 focus:ring-0 focus:outline-none resize-none placeholder:text-neutral-300"
              />
              {speichert === b.key && <p className="text-xs text-neutral-400 mt-1">Speichern...</p>}
            </div>
          ))}
          <p className="text-xs text-neutral-400">Änderungen werden automatisch gespeichert.</p>
        </div>

        {/* KI Acting Coach */}
        <div className="lg:sticky lg:top-6">
          <h2 className="text-sm font-semibold mb-5">Acting Coach</h2>
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className="flex gap-2 mb-3 flex-wrap">
              {[
                { label: "Rolle analysieren", prompt: "Analysiere meine bisherige Charakterarbeit zu dieser Rolle. Was ist stark, wo sind Lücken, welche Fragen sollte ich mir noch stellen?" },
                { label: "Fragen an die Figur", prompt: "Stell mir 5 tiefgehende Fragen zu meiner Figur, die mir helfen, sie besser zu verstehen." },
                { label: "Chubbuck-Ansatz", prompt: "Wie würde ich diese Rolle nach der Chubbuck-Technik aufbauen? Führe mich durch die wichtigsten Schritte." },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => coachFragen(a.prompt)}
                  disabled={coachLaeuft}
                  className="text-xs bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-full hover:border-neutral-400 transition disabled:opacity-50"
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
                placeholder="Frag den Coach zu dieser Rolle..."
                className="flex-1 border border-neutral-300 rounded px-3 py-2 text-sm"
              />
              <button
                onClick={() => coachFragen()}
                disabled={coachLaeuft}
                className="bg-neutral-900 text-white px-3 py-2 rounded text-sm hover:bg-neutral-700 transition disabled:opacity-50"
              >
                {coachLaeuft ? "..." : "Fragen"}
              </button>
            </div>

            {coachLaeuft && (
              <div className="flex items-center gap-2 mt-4">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}

            {antwort && !coachLaeuft && (
              <p className="text-sm whitespace-pre-wrap leading-relaxed mt-4 pt-4 border-t border-neutral-100">
                {antwort}
              </p>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            Der Coach kennt deine Charakterarbeit — je mehr du links ausfüllst, desto besser seine Antworten.
          </p>
        </div>
      </div>
    </div>
  );
}
