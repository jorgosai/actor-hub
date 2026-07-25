"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700 transition"
      >
        + Neue Rolle
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rollenname *</label>
              <input name="name" required placeholder="z.B. Hamlet" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Produktion / Stück</label>
              <input name="production" placeholder="z.B. Hamlet — Schauspielhaus Bochum" className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700 transition disabled:opacity-50">
            {loading ? "Erstellen..." : "Rolle anlegen"}
          </button>
        </form>
      )}
    </div>
  );
}
