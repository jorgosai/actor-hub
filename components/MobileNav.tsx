"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NavIcon, type NavGruppe } from "@/components/nav-items";

export default function MobileNav({
  gruppen,
  name,
  abmelden,
}: {
  gruppen: NavGruppe[];
  name: string;
  abmelden?: React.ReactNode;
}) {
  const [offen, setOffen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/login") || pathname.startsWith("/reset")) return null;

  return (
    <div className="lg:hidden">
      {/* Kopfleiste */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h7v9a3.5 3.5 0 0 1-7 0z" />
              <path d="M13 5h7v6a3.5 3.5 0 0 1-7 0z" />
            </svg>
          </span>
          <span className="font-serif text-[calc(1.15rem*var(--serif-skala))] font-semibold tracking-tight text-foreground">Actor Hub</span>
        </div>
        <button
          onClick={() => setOffen(!offen)}
          aria-label={offen ? "Menü schließen" : "Menü öffnen"}
          className="-mr-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary"
        >
          {offen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Überlagerung */}
      {offen && (
        <div className="fixed inset-0 z-30 overflow-y-auto bg-background px-4 pb-8 pt-16">
          {gruppen.map((gruppe) => (
            <div key={gruppe.titel} className="mb-6">
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {gruppe.titel}
              </p>
              <div className="flex flex-col gap-0.5">
                {gruppe.items.map((item) => {
                  const aktiv = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOffen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] transition-colors ${
                        aktiv
                          ? "bg-brand/10 font-semibold text-brand"
                          : "font-medium text-muted-foreground"
                      }`}
                    >
                      <NavIcon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-border px-3 pt-4">
            <p className="text-xs text-muted-foreground">Angemeldet als {name}</p>
            {abmelden}
          </div>
        </div>
      )}
    </div>
  );
}
