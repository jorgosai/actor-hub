"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; icon: string };

export default function MobileNav({ items, name }: { items: Item[]; name: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/login")) return null;

  return (
    <div className="md:hidden">
      {/* Top-Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 h-14">
        <div>
          <span className="text-[9px] font-semibold tracking-widest uppercase text-sidebar-foreground/40 block leading-none mb-0.5">
            Actor Hub
          </span>
          <span className="text-sm font-light text-sidebar-foreground leading-none">{name}</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-sidebar-foreground p-2 -mr-2"
          aria-label="Menü"
        >
          {open ? (
            <span className="text-xl leading-none">×</span>
          ) : (
            <span className="flex flex-col gap-1">
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
            </span>
          )}
        </button>
      </div>

      {/* Overlay-Menü */}
      {open && (
        <div className="fixed inset-0 z-30 bg-sidebar pt-16 px-4">
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition ${
                  pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/60"
                }`}
              >
                <span className="w-5 text-center">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
