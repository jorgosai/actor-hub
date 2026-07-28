"use client";

import { useState } from "react";
import { FELD, KARTE, KNOPF_KLEIN, KNOPF_PRIMAER } from "@/components/stil";
import { SeitenKopf } from "@/components/seiten-kopf";

const SCHNELLAKTIONEN = [
  { label: "Follow-up Erinnerungen", prompt: "Welche meiner Bewerbungen brauchen bald ein Follow-up? Analysiere die Daten und gib mir konkrete Empfehlungen." },
  { label: "Bewerbungsanalyse", prompt: "Analysiere meine Bewerbungen. Welche Muster erkennst du? Für welche Art von Rollen werde ich öfter angefragt?" },
  { label: "Kontakt Follow-up", prompt: "Mit welchen Kontakten sollte ich mich bald wieder melden? Wer könnte für meine aktuelle Karriere wichtig sein?" },
  { label: "E-Mail schreiben", prompt: "Schreib mir eine professionelle Follow-up E-Mail für meine letzte Bewerbung. Nutze die Daten aus meinen Bewerbungen und passe den Ton an die Kategorie des Kontakts an." },
  { label: "Karriere-Strategie", prompt: "Analysiere mein Profil basierend auf meinen Bewerbungen und Projekten. Was sind meine Stärken? Welche Art von Rollen sollte ich mehr anstreben?" },
];

export default function AssistentPage() {
  const [prompt, setPrompt] = useState("");
  const [antwort, setAntwort] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(text?: string) {
    const frage = text ?? prompt;
    if (!frage.trim()) return;
    setLoading(true);
    setAntwort("");
    setPrompt("");
    const res = await fetch("/api/assistent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: frage }),
    });
    const data = await res.json();
    setAntwort(data.antwort ?? data.error ?? "Etwas ist schiefgelaufen. Bitte nochmal versuchen.");
    setLoading(false);
  }

  return (
    <>
      <SeitenKopf
        eyebrow="Werkzeuge"
        titel="KI-Assistent"
        beschreibung="Frag mich alles über deine Castings, Kontakte und Karriere — ich kenne deine Daten."
      />

      <div className="flex flex-wrap gap-2">
        {SCHNELLAKTIONEN.map((a) => (
          <button
            key={a.label}
            onClick={() => handleSend(a.prompt)}
            className={KNOPF_KLEIN}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Schreib eine Frage oder Aufgabe…"
          className={`${FELD} flex-1`}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className={KNOPF_PRIMAER}
        >
          {loading ? "…" : "Senden"}
        </button>
      </div>

      {loading && (
        <div className={KARTE}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-muted-foreground/45 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-muted-foreground/45 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-muted-foreground/45 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      {antwort && !loading && (
        <div className={KARTE}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{antwort}</p>
        </div>
      )}
    </>
  );
}
