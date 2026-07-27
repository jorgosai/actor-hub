"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [modus, setModus] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value;

    if (modus === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: val("name"), email: val("email"), password: val("password"), inviteCode: val("inviteCode") }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Registrierung fehlgeschlagen.");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email: val("email"),
      password: val("password"),
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("E-Mail oder Passwort falsch.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">
            Actor Hub
          </p>
          <h1 className="text-2xl font-light tracking-tight">
            {modus === "login" ? "Willkommen zurück" : "Konto erstellen"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
          {modus === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Einladungscode</label>
                <input name="inviteCode" required className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
                <p className="text-xs text-neutral-400 mt-1">Actor Hub ist aktuell nur auf Einladung nutzbar.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input name="name" required className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">E-Mail</label>
            <input name="email" type="email" required className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Passwort</label>
            <input
              name="password"
              type="password"
              required
              minLength={modus === "register" ? 8 : undefined}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
            />
            {modus === "register" && (
              <p className="text-xs text-neutral-400 mt-1">Mindestens 8 Zeichen</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-700 transition disabled:opacity-50"
          >
            {loading ? "Bitte warten..." : modus === "login" ? "Einloggen" : "Registrieren"}
          </button>
        </form>

        {modus === "login" && (
          <p className="text-center text-xs text-neutral-400 mt-4">
            Passwort vergessen? Melde dich beim Betreiber — du bekommst einen Link zum Zurücksetzen.
          </p>
        )}

        <p className="text-center text-sm text-neutral-500 mt-6">
          {modus === "login" ? (
            <>
              Noch kein Konto?{" "}
              <button onClick={() => { setModus("register"); setError(""); }} className="text-neutral-900 font-medium hover:underline">
                Registrieren
              </button>
            </>
          ) : (
            <>
              Schon registriert?{" "}
              <button onClick={() => { setModus("login"); setError(""); }} className="text-neutral-900 font-medium hover:underline">
                Einloggen
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
