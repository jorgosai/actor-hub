"use client";

import { useState } from "react";

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
        <div key={u.id} className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-sm font-medium">{u.name}</p>
              <p className="text-xs text-neutral-400 truncate">{u.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-neutral-400">dabei seit</p>
                <p className="text-xs">{u.seit}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400">KI heute</p>
                <p className="text-xs tabular-nums">{u.kiHeute}</p>
              </div>
              <button
                onClick={() => linkErzeugen(u.id)}
                disabled={busy === u.id}
                className="text-xs border border-neutral-300 rounded-full px-3 py-1.5 hover:bg-neutral-50 transition disabled:opacity-50 whitespace-nowrap"
              >
                {busy === u.id ? "..." : "Passwort-Link"}
              </button>
            </div>
          </div>

          {links[u.id] && (
            <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-2">
              <input
                readOnly
                value={links[u.id]}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1.5 font-mono"
              />
              <button
                onClick={() => kopieren(u.id)}
                className="text-xs bg-neutral-900 text-white rounded px-3 py-1.5 hover:bg-neutral-700 transition whitespace-nowrap"
              >
                {kopiert === u.id ? "Kopiert ✓" : "Kopieren"}
              </button>
            </div>
          )}
        </div>
      ))}

      <p className="text-xs text-neutral-400 pt-2">
        Der Passwort-Link ist 24 Stunden gültig und kann einmal benutzt werden. Schick ihn der Person
        direkt (WhatsApp, SMS, E-Mail) — damit setzt sie sich selbst ein neues Passwort.
      </p>
    </div>
  );
}
