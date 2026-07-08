export default function KontaktePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Kontakte</h1>
        <button className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-700 transition">
          + Neuer Kontakt
        </button>
      </div>
      <p className="text-neutral-500">Noch keine Kontakte eingetragen.</p>
    </div>
  );
}