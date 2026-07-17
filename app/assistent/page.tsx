"use client";

import { useState } from "react";

const SCHNELLAKTIONEN = [
  { label: "Follow-up Erinnerungen", prompt: "Welche meiner Bewerbungen brauchen bald ein Follow-up? Analysiere die Daten und gib mir konkrete Empfehlungen." },
  { label: "Bewerbungsanalyse", prompt: "Analysiere meine Bewerbungen. Welche Muster erkennst du? Für welche Art von Rollen werde ich öfter angefragt?" },
  { label: "Kontakt Follow-up", prompt: "Mit welchen Kontakten sollte ich mich bald wieder melden? Wer könnte für meine aktuelle Karriere wichtig sein?" },
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
    const res = await fetch("/api/assistent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: frage }),
    });
    const data = await res.json();
    setAntwort(data.antwort);
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">KI-Assistent</h1>
      <p className="text-neutral-500 mb-8">Frag mich alles über deine Bewerbungen, Kontakte und Karriere.</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {SCHNELLAKTIONEN.map((a) => (
          <button
            key={a.label}
            onClick={() => handleSend(a.prompt)}
            className="text-sm bg-white border border-neutral-200 px-4 py-2 rounded-full hover:border-neutral-400 transition"
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Schreib eine Frage oder Aufgabe..."
          className="flex-1 border border-neutral-300 rounded px-4 py-2 text-sm"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700 transition disabled:opacity-50"
        >
          {loading ? "..." : "Senden"}
        </button>
      </div>

      {loading && (
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <p className="text-neutral-500 text-sm">Denke nach...</p>
        </div>
      )}

      {antwort && !loading && (
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <p className="text-sm whitespace-pre-wrap">{antwort}</p>
        </div>
      )}
    </div>
  );
}
