import Link from "next/link";
import { Plus } from "lucide-react";

function begruessung(): string {
  const h = new Date().getHours();
  if (h < 11) return "Guten Morgen";
  if (h < 18) return "Hallo";
  return "Guten Abend";
}

export function DashboardHeader({ vorname }: { vorname: string }) {
  const datum = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="animate-rise flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] text-brand`}>
          {datum}
        </p>
        <h1 className={`mt-2 text-balance text-foreground font-serif text-[calc(2.1rem*var(--serif-skala))] leading-[1.08] sm:text-[calc(3rem*var(--serif-skala))] lg:text-[calc(3.75rem*var(--serif-skala))]`}>
          {begruessung()}, {vorname}
        </h1>
      </div>

      <Link
        href="/bewerbungen"
        className="group inline-flex w-fit items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-colors duration-200 hover:bg-brand/90"
      >
        <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
        Neues Casting
      </Link>
    </header>
  );
}
