"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BewerbungForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = {
      role: (form.elements.namedItem("role") as HTMLInputElement).value,
      production: (form.elements.namedItem("production") as HTMLInputElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
    };
    await fetch("/api/bewerbungen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700 transition"
      >
        + Neue Bewerbung
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rolle</label>
            <input name="role" required className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Produktion</label>
            <input name="production" required className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notizen</label>
            <textarea name="notes" rows={3} className="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700 transition disabled:opacity-50"
          >
            {loading ? "Speichern..." : "Speichern"}
          </button>
        </form>
      )}
    </div>
  );
}