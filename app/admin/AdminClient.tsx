"use client";

import { useState } from "react";
import { KARTE, KNOPF_KLEIN } from "@/components/stil";

type Nutzer = {
  id: string;
  name: string;
  email: string;
  seit: string;
  kiHeute: number;
};

export default function AdminClient({ nutzer }: { nutzer: Nutzer[] }) {
  const [links, setLinks] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [kopiert, setKopiert] = useState<string | null>(null);

  async function linkErzeugen(userId: string) {
    setBusy(userId);
    const res = await fetch("/api/admin/reset-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    setBusy(null);
    if (data.url) setLinks({ ...links, [userId]: data.url });
  }

  async function kopieren(userId: string) {
    await navigator.clipboard.writeText(links[userId]);
    setKopiert(userId);
    setTimeout(() => setKopiert(null), 2000);
  }

  return (
    <div className="space-y-3">
      {nutzer.map((u) => (
        <div key={u.id} className={KARTE}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-sm font-medium">{u.name}</p>
              <p className="text-xs text-muted-foreground/80 truncate">{u.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground/80">dabei seit</p>
                <p className="text-xs">{u.seit}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground/80">KI heute</p>
                <p className="text-xs tabular-nums">{u.kiHeute}</p>
              </div>
              <button
                onClick={() => linkErzeugen(u.id)}
                disabled={busy === u.id}
                className={`${KNOPF_KLEIN} whitespace-nowrap disabled:opacity-50`}
              >
                {busy === u.id ? "..." : "Passwort-Link"}
              </button>
            </div>
          </div>

          {links[u.id] && (
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
              <input
                readOnly
                value={links[u.id]}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 rounded-lg bg-secondary px-2.5 py-1.5 font-mono text-xs text-secondary-foreground"
              />
              <button
                onClick={() => kopieren(u.id)}
                className="text-xs bg-brand text-brand-foreground rounded px-3 py-1.5 hover:bg-brand/90 transition whitespace-nowrap"
              >
                {kopiert === u.id ? "Kopiert ✓" : "Kopieren"}
              </button>
            </div>
          )}
        </div>
      ))}

      <p className="text-xs text-muted-foreground/80 pt-2">
        Der Passwort-Link ist 24 Stunden gültig und kann einmal benutzt werden. Schick ihn der Person
        direkt (WhatsApp, SMS, E-Mail) — damit setzt sie sich selbst ein neues Passwort.
      </p>
    </div>
  );
}
