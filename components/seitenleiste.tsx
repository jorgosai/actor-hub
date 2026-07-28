"use client";

import { LogOut } from "lucide-react";
import type { NavGruppe } from "@/components/nav-items";
import { NavLink } from "@/components/nav-link";

/** Feste Seitenleiste ab Desktop-Breite. Mobil übernimmt MobileNav. */
export function Seitenleiste({
  gruppen,
  name,
  initialen,
  abmelden,
}: {
  gruppen: NavGruppe[];
  name: string;
  initialen: string;
  abmelden?: React.ReactNode;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 5h7v9a3.5 3.5 0 0 1-7 0z" />
            <path d="M13 5h7v6a3.5 3.5 0 0 1-7 0z" />
          </svg>
        </span>
        <span
          className="font-serif text-[calc(1.25rem*var(--serif-skala))] font-semibold tracking-tight text-foreground"
        >
          Actor Hub
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {gruppen.map((gruppe) => (
          <div key={gruppe.titel} className="mb-5">
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {gruppe.titel}
            </p>
            <div className="flex flex-col gap-0.5">
              {gruppe.items.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-border px-5 py-4">
        <span className="ah-glimm flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stat-peach text-xs font-semibold text-stat-peach-foreground">
          {initialen}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">
            Schauspieler:in
          </p>
        </div>
        {abmelden}
      </div>
    </aside>
  );
}

/** Der Abmelde-Knopf, damit die Server-Action im Layout bleiben kann. */
export function AbmeldeKnopf() {
  return (
    <button
      type="submit"
      title="Abmelden"
      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
