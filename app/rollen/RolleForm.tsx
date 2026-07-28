"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FELD,
  KARTE,
  KNOPF_PRIMAER,
  LABEL,
} from "@/components/stil";
import { Plus } from "lucide-react";

export default function RolleForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value;
    const res = await fetch("/api/rollen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: val("name"), production: val("production") }),
    });
    const rolle = await res.json();
    setLoading(false);
    setOpen(false);
    router.push(`/rollen/${rolle.id}`);
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={KNOPF_PRIMAER}
      >
        <Plus className="h-4 w-4" />
        Neue Rolle
      </button>

      {open && (
        <form onSubmit={handleSubmit} className={`${KARTE} mt-4 flex flex-col gap-5`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Rollenname *</label>
              <input name="name" required placeholder="z.B. Hamlet" className={FELD} />
            </div>
            <div>
              <label className={LABEL}>Produktion / Stück</label>
              <input name="production" placeholder="z.B. Hamlet — Schauspielhaus Bochum" className={FELD} />
            </div>
          </div>
          <button type="submit" disabled={loading} className={KNOPF_PRIMAER}>
            {loading ? "Erstellen..." : "Rolle anlegen"}
          </button>
        </form>
      )}
    </div>
  );
}
