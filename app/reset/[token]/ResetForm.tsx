"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FELD, KARTE, LABEL } from "@/components/stil";

export default function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fertig, setFertig] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value;

    if (val("password") !== val("password2")) {
      setError("Die beiden Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: val("password") }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Das hat nicht geklappt.");
      return;
    }
    setFertig(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/80 mb-1">
            Actor Hub
          </p>
          <h1 className="font-serif text-[calc(2.25rem*var(--serif-skala))] leading-[1.15] text-foreground">Neues Passwort</h1>
        </div>

        {fertig ? (
          <div className={`${KARTE} text-center`}>
            <p className="text-sm mb-4">Dein Passwort wurde geändert.</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
            >
              Zum Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={`${KARTE} flex flex-col gap-4`}>
            <div>
              <label className={LABEL}>Neues Passwort</label>
              <input name="password" type="password" required minLength={8} className={FELD} />
              <p className="text-xs text-muted-foreground/80 mt-1">Mindestens 8 Zeichen</p>
            </div>
            <div>
              <label className={LABEL}>Passwort wiederholen</label>
              <input name="password2" type="password" required minLength={8} className={FELD} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? "Speichern…" : "Passwort ändern"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/login" className="hover:underline">Zurück zum Login</Link>
        </p>
      </div>
    </div>
  );
}
