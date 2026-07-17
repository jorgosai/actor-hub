"use client";

import { useRouter } from "next/navigation";

const STATUS_OPTIONEN = [
  "Beworben",
  "Eingeladen",
  "Callback",
  "Angenommen",
  "Abgesagt",
];

const STATUS_FARBEN: Record<string, string> = {
  Beworben: "bg-blue-100 text-blue-800",
  Eingeladen: "bg-yellow-100 text-yellow-800",
  Callback: "bg-purple-100 text-purple-800",
  Angenommen: "bg-green-100 text-green-800",
  Abgesagt: "bg-red-100 text-red-800",
};

type Props = {
  id: string;
  role: string;
  production: string;
  status: string;
  notes: string | null;
};

export default function BewerbungKarte({ id, role, production, status, notes }: Props) {
  const router = useRouter();

  async function handleStatusChange(neuerStatus: string) {
    await fetch(`/api/bewerbungen/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: neuerStatus }),
    });
    router.refresh();
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{role}</h2>
          <p className="text-sm text-neutral-500">{production}</p>
        </div>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`text-xs px-3 py-1 rounded-full border-0 font-medium cursor-pointer ${STATUS_FARBEN[status] ?? "bg-neutral-100"}`}
        >
          {STATUS_OPTIONEN.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      {notes && <p className="text-sm text-neutral-600 mt-2">{notes}</p>}
    </div>
  );
}
