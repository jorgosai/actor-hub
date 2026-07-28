import {
  LayoutGrid,
  Calendar,
  ListChecks,
  Clapperboard,
  Drama,
  Film,
  Users,
  FolderOpen,
  Target,
  NotebookPen,
  Sparkles,
  Settings,
} from "lucide-react";

/** Zentrale Menü-Definition — von Seitenleiste und Handy-Menü gemeinsam benutzt. */

const ICONS = {
  dashboard: LayoutGrid,
  kalender: Calendar,
  aufgaben: ListChecks,
  castings: Clapperboard,
  rollen: Drama,
  projekte: Film,
  kontakte: Users,
  material: FolderOpen,
  ziele: Target,
  journal: NotebookPen,
  ki: Sparkles,
  verwaltung: Settings,
} as const;

export type IconName = keyof typeof ICONS;

export type NavItem = { href: string; label: string; icon: IconName };
export type NavGruppe = { titel: string; items: NavItem[] };

export const NAV_GRUPPEN: NavGruppe[] = [
  {
    titel: "Übersicht",
    items: [
      { href: "/", label: "Dashboard", icon: "dashboard" },
      { href: "/kalender", label: "Kalender", icon: "kalender" },
      { href: "/aufgaben", label: "Aufgaben", icon: "aufgaben" },
    ],
  },
  {
    titel: "Arbeit",
    items: [
      { href: "/bewerbungen", label: "Castings", icon: "castings" },
      { href: "/rollen", label: "Rollen", icon: "rollen" },
      { href: "/projekte", label: "Projekte", icon: "projekte" },
      { href: "/kontakte", label: "Kontakte", icon: "kontakte" },
      { href: "/material", label: "Material", icon: "material" },
    ],
  },
  {
    titel: "Entwicklung",
    items: [
      { href: "/karriere", label: "Ziele", icon: "ziele" },
      { href: "/journal", label: "Journal", icon: "journal" },
    ],
  },
  {
    titel: "Werkzeuge",
    items: [{ href: "/assistent", label: "KI-Assistent", icon: "ki" }],
  },
];

export const ADMIN_ITEM: NavItem = {
  href: "/admin",
  label: "Verwaltung",
  icon: "verwaltung",
};

export function NavIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} />;
}
