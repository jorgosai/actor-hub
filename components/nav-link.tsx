"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon, type NavItem } from "@/components/nav-items";

export function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const aktiv = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  /*
    Zurückhaltender Aktiv-Zustand: blass getönte Fläche statt voller
    Markenfarbe. Alle vergleichbaren Apps mit Seitenleiste machen es so.
  */
  return (
    <Link
      href={item.href}
      aria-current={aktiv ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
        aktiv
          ? "bg-brand/10 font-semibold text-brand"
          : "font-medium text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
      }`}
    >
      <NavIcon
        name={item.icon}
        className={`h-[18px] w-[18px] shrink-0 transition-opacity ${
          aktiv ? "text-brand opacity-100" : "opacity-70 group-hover:opacity-100"
        }`}
      />
      {item.label}
    </Link>
  );
}
