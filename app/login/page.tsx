"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FELD, LABEL } from "@/components/stil";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-9 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h7v9a3.5 3.5 0 0 1-7 0z" />
              <path d="M13 5h7v6a3.5 3.5 0 0 1-7 0z" />
            </svg>
          </span>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Actor Hub
          </p>
          <h1 className="mt-2 font-serif text-[calc(2.25rem*var(--serif-skala))] leading-[1.15] text-foreground">
            {modus === "login" ? "Willkommen zurück" : "Konto erstellen"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {modus === "login"
              ? "Deine Castings, Rollen und Kontakte an einem Ort."
              : "Mit Einladungscode geht es in wenigen Sekunden los."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-3xl bg-card p-6 sm:p-7"
        >
          {modus === "register" && (
            <>
              <div>
                <label className={LABEL}>Einladungscode</label>
                <input name="inviteCode" required className={FELD} />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Actor Hub ist aktuell nur auf Einladung nutzbar.
                </p>
              </div>
              <div>
                <label className={LABEL}>Name</label>
                <input name="name" required className={FELD} />
              </div>
            </>
          )}
          <div>
            <label className={LABEL}>E-Mail</label>
            <input name="email" type="email" required className={FELD} />
          </div>
          <div>
            <label className={LABEL}>Passwort</label>
            <input
              name="password"
              type="password"
              required
              minLength={modus === "register" ? 8 : undefined}
              className={FELD}
            />
            {modus === "register" && (
              <p className="mt-1.5 text-xs text-muted-foreground">Mindestens 8 Zeichen</p>
            )}
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-full bg-brand py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? "Bitte warten…" : modus === "login" ? "Einloggen" : "Registrieren"}
          </button>
        </form>

        {modus === "login" && (
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Passwort vergessen? Melde dich beim Betreiber — du bekommst einen Link zum Zurücksetzen.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {modus === "login" ? (
            <>
              Noch kein Konto?{" "}
              <button onClick={() => { setModus("register"); setError(""); }} className="font-semibold text-brand hover:underline">
                Registrieren
              </button>
            </>
          ) : (
            <>
              Schon registriert?{" "}
              <button onClick={() => { setModus("login"); setError(""); }} className="font-semibold text-brand hover:underline">
                Einloggen
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
