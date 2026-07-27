"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">
            Actor Hub
          </p>
          <h1 className="text-2xl font-light tracking-tight">Neues Passwort</h1>
        </div>

        {fertig ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-sm mb-4">Dein Passwort wurde geändert.</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-neutral-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-700 transition"
            >
              Zum Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div>
              <label className="block text-sm font-medium mb-1">Neues Passwort</label>
              <input name="password" type="password" required minLength={8} className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
              <p className="text-xs text-neutral-400 mt-1">Mindestens 8 Zeichen</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Passwort wiederholen</label>
              <input name="password2" type="password" required minLength={8} className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-700 transition disabled:opacity-50"
            >
              {loading ? "Speichern..." : "Passwort ändern"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-neutral-500 mt-6">
          <Link href="/login" className="hover:underline">Zurück zum Login</Link>
        </p>
      </div>
    </div>
  );
}
