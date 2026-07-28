import Link from "next/link";
import { Clapperboard, PhoneCall, Users, Drama } from "lucide-react";
import { KENNZAHL_LABEL } from "@/components/stil";

export type Kennzahl = {
  wert: string;
  label: string;
  zusatz?: string;
  href: string;
  ton: "sky" | "mint" | "peach" | "butter";
  icon: "castings" | "recall" | "kontakte" | "rollen";
};

const ICONS = {
  castings: Clapperboard,
  recall: PhoneCall,
  kontakte: Users,
  rollen: Drama,
};

const TOENE = {
  sky: "bg-stat-sky text-stat-sky-foreground",
  mint: "bg-stat-mint text-stat-mint-foreground",
  peach: "bg-stat-peach text-stat-peach-foreground",
  butter: "bg-stat-butter text-stat-butter-foreground",
};

export function StatCards({ kennzahlen }: { kennzahlen: Kennzahl[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {kennzahlen.map((k, i) => {
        const Icon = ICONS[k.icon];
        return (
          <Link
            key={k.label}
            href={k.href}
            className={`animate-rise group rounded-3xl p-4 ring-1 sm:p-5 ring-transparent transition-[box-shadow,filter] duration-200 hover:ring-foreground/10 hover:brightness-[0.985] ${TOENE[k.ton]}`}
            style={{ animationDelay: `${140 + i * 70}ms` }}
          >
            <div className="flex items-start justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11 sm:rounded-2xl bg-brand text-brand-foreground`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              {k.zusatz && (
                <span className="inline-flex items-center rounded-full bg-card/55 px-2 py-0.5 text-[10px] font-semibold backdrop-blur sm:px-2.5 sm:py-1 sm:text-xs">
                  {k.zusatz}
                </span>
              )}
            </div>
            <p className={`mt-4 tabular-nums sm:mt-6 font-serif text-[calc(2.1rem*var(--serif-skala))] sm:text-[calc(3rem*var(--serif-skala))]`}>
              {k.wert}
            </p>
            <p className={`mt-2 opacity-70 ${KENNZAHL_LABEL}`}>{k.label}</p>
          </Link>
        );
      })}
    </div>
  );
}
