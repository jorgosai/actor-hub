"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FELD, ICON_KNOPF_LOESCHEN, KARTE, LABEL } from "@/components/stil";
import { Plus, X } from "lucide-react";

type Szene = {
  id: string;
  title: string;
  text: string | null;
  notes: string | null;
};

type Msg = { role: "user" | "assistant"; content: string };

export default function SzenenBereich({ roleId, szenen }: { roleId: string; szenen: Szene[] }) {
  const router = useRouter();
  const [offen, setOffen] = useState<string | null>(null);
  const [neuOffen, setNeuOffen] = useState(false);
  const [busy, setBusy] = useState(false);

  // Proben-Chat
  const [modus, setModus] = useState<"partner" | "abfrage">("partner");
  const [chat, setChat] = useState<Msg[]>([]);
  const [eingabe, setEingabe] = useState("");
  const [vorlesen, setVorlesen] = useState(false);
  const [hoert, setHoert] = useState(false);

  const aktiv = szenen.find((s) => s.id === offen);

  async function neueSzene(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement).value;
    await fetch("/api/szenen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleId, title: val("title"), text: val("text") }),
    });
    setBusy(false);
    setNeuOffen(false);
    router.refresh();
  }

  async function textSpeichern(id: string, text: string) {
    await fetch(`/api/szenen/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    router.refresh();
  }

  async function szeneLoeschen(id: string) {
    if (!confirm("Szene wirklich löschen?")) return;
    await fetch(`/api/szenen/${id}`, { method: "DELETE" });
    if (offen === id) setOffen(null);
    router.refresh();
  }

  async function senden(start?: string) {
    const text = start ?? eingabe;
    if (!text.trim() || !aktiv) return;
    const neueMsgs: Msg[] = [...chat, { role: "user", content: text }];
    setChat(neueMsgs);
    setEingabe("");
    setBusy(true);
    const res = await fetch(`/api/szenen/${aktiv.id}/partner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: neueMsgs, modus }),
    });
    const data = await res.json();
    const antwortText: string = data.antwort ?? data.error ?? "Etwas ist schiefgelaufen. Bitte nochmal versuchen.";
    setChat([...neueMsgs, { role: "assistant", content: antwortText }]);
    setBusy(false);
    if (data.antwort && vorlesen && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      // Figurennamen (GROSSBUCHSTABEN:) nicht mitsprechen
      const gesprochen = antwortText.replace(/^[A-ZÄÖÜ]{2,}[^:]*:\s*/gm, "");
      const u = new SpeechSynthesisUtterance(gesprochen);
      u.lang = "de-DE";
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  }

  function aufnahmeStarten() {
    type SR = { new (): {
      lang: string; interimResults: boolean; continuous: boolean;
      onresult: (e: { results: { [i: number]: { [j: number]: { transcript: string } } }; resultIndex: number }) => void;
      onend: () => void; onerror: () => void; start: () => void;
    } };
    const w = window as unknown as { SpeechRecognition?: SR; webkitSpeechRecognition?: SR };
    const Erkennung = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Erkennung) {
      alert("Spracheingabe wird von diesem Browser nicht unterstützt. Nutze Chrome oder Safari.");
      return;
    }
    const rec = new Erkennung();
    rec.lang = "de-DE";
    rec.interimResults = false;
    rec.continuous = false;
    setHoert(true);
    rec.onresult = (e) => {
      const text = e.results[e.resultIndex][0].transcript;
      setEingabe((alt) => (alt ? alt + " " + text : text));
    };
    rec.onend = () => setHoert(false);
    rec.onerror = () => setHoert(false);
    rec.start();
  }

  function probeStarten(m: "partner" | "abfrage") {
    setModus(m);
    setChat([]);
    senden(
      m === "abfrage"
        ? "Lass uns die Textabfrage starten. Gib mir mein erstes Stichwort."
        : "Lass uns die Szene von Anfang an proben. Du beginnst, falls die andere Figur anfängt — sonst warte auf mich."
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Szenen & Text</h2>
        <button
          onClick={() => setNeuOffen(!neuOffen)}
          className="bg-brand text-brand-foreground px-3 py-1.5 rounded text-sm hover:bg-brand/90 transition"
        >
          <Plus className="h-4 w-4" />
          Neue Szene
        </button>
      </div>

      {neuOffen && (
        <form onSubmit={neueSzene} className={`${KARTE} mb-4 flex flex-col gap-4`}>
          <div>
            <label className={LABEL}>Titel *</label>
            <input name="title" required placeholder="z.B. Akt 3, Szene 1" className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Szenentext (kompletter Dialog, mit Figurennamen)</label>
            <textarea name="text" rows={6} placeholder={"HAMLET: Sein oder Nichtsein...\nOPHELIA: Mein Prinz..."} className="w-full border border-border rounded px-3 py-2 text-sm font-mono" />
          </div>
          <button type="submit" disabled={busy} className="bg-brand text-brand-foreground px-4 py-2 rounded text-sm hover:bg-brand/90 transition disabled:opacity-50">
            Szene anlegen
          </button>
        </form>
      )}

      {szenen.length === 0 && !neuOffen && (
        <p className="text-sm text-muted-foreground">
          Noch keine Szenen. Leg eine Szene mit Text an — dann kann die KI dein Szenenpartner sein oder dich abfragen.
        </p>
      )}

      <div className="space-y-2">
        {szenen.map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between px-4 py-3">
              <button onClick={() => { setOffen(offen === s.id ? null : s.id); setChat([]); }} className="text-sm font-medium text-left flex-1">
                {s.title} {s.text ? "" : <span className="text-muted-foreground/45 font-normal">— kein Text</span>}
              </button>
              <button onClick={() => szeneLoeschen(s.id)} className={ICON_KNOPF_LOESCHEN} title="Löschen">
                <X className="h-4 w-4" />
              </button>
            </div>

            {offen === s.id && (
              <div className="border-t border-border p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {/* Text */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80 mb-2">Text</p>
                  <textarea
                    defaultValue={s.text ?? ""}
                    onBlur={(e) => { if (e.target.value !== (s.text ?? "")) textSpeichern(s.id, e.target.value); }}
                    rows={14}
                    placeholder="Szenentext hier einfügen..."
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm font-mono resize-y"
                  />
                </div>

                {/* Probe */}
                <div>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => probeStarten("partner")}
                      disabled={busy || !s.text}
                      className="text-xs bg-brand text-brand-foreground px-3 py-1.5 rounded-full hover:bg-brand/90 transition disabled:opacity-40"
                    >
                      ▶ Szene proben
                    </button>
                    <button
                      onClick={() => probeStarten("abfrage")}
                      disabled={busy || !s.text}
                      className="text-xs border border-border px-3 py-1.5 rounded-full hover:bg-secondary transition disabled:opacity-40"
                    >
                      Text abfragen
                    </button>
                    <button
                      onClick={() => {
                        if (vorlesen) window.speechSynthesis?.cancel();
                        setVorlesen(!vorlesen);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${vorlesen ? "border-brand/30 bg-brand/10 text-brand" : "border-border hover:bg-secondary"}`}
                      title="Partner-Zeilen vorlesen"
                    >
                      {vorlesen ? "🔊 Vorlesen an" : "🔇 Vorlesen aus"}
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto mb-3">
                    {chat.map((m, i) => (
                      <div key={i} className={`text-sm rounded-lg px-3 py-2 whitespace-pre-wrap ${m.role === "user" ? "ml-6 bg-secondary" : "mr-6 bg-brand/8"}`}>
                        {m.content}
                      </div>
                    ))}
                    {busy && <p className="text-xs text-muted-foreground/80">Partner denkt...</p>}
                  </div>

                  {chat.length > 0 && (
                    <div className="flex gap-2">
                      <input
                        value={eingabe}
                        onChange={(e) => setEingabe(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && senden()}
                        placeholder={modus === "abfrage" ? "Deine Textzeile..." : "Deine Zeile (oder REGIE: Frage)..."}
                        className="flex-1 border border-border rounded px-3 py-2 text-sm"
                      />
                      <button
                        onClick={aufnahmeStarten}
                        disabled={busy || hoert}
                        className={`px-3 py-2 rounded text-sm border transition ${hoert ? "bg-destructive/12 border-destructive/30 animate-pulse" : "border-border hover:bg-secondary"}`}
                        title="Zeile einsprechen"
                      >
                        {hoert ? "●" : "🎤"}
                      </button>
                      <button onClick={() => senden()} disabled={busy} className="bg-brand text-brand-foreground px-3 py-2 rounded text-sm disabled:opacity-50">
                        →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
