import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import MobileNav from "@/components/MobileNav";
import { istAdmin } from "@/lib/admin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Actor Hub",
  description: "Business Management für Schauspieler",
};

const navItems = [
  { href: "/", label: "Dashboard", icon: "⬡" },
  { href: "/kalender", label: "Kalender", icon: "▤" },
  { href: "/aufgaben", label: "Aufgaben", icon: "☑" },
  { href: "/bewerbungen", label: "Castings", icon: "◎" },
  { href: "/kontakte", label: "Kontakte", icon: "◉" },
  { href: "/projekte", label: "Projekte", icon: "▣" },
  { href: "/rollen", label: "Rollen", icon: "❋" },
  { href: "/material", label: "Material", icon: "◈" },
  { href: "/karriere", label: "Karriere", icon: "◆" },
  { href: "/journal", label: "Journal", icon: "✎" },
  { href: "/assistent", label: "KI-Assistent", icon: "✦" },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const adminSichtbar = session?.user?.id ? await istAdmin(session.user.id) : false;
  const items = adminSichtbar
    ? [...navItems, { href: "/admin", label: "Verwaltung", icon: "⚙" }]
    : navItems;
  const name = session?.user?.name ?? "Actor Hub";
  const initialen = name
    .split(" ")
    .map((t) => t[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <html lang="de" className={`${geistSans.variable} h-full`}>
      <body className="h-full flex bg-background">
        <MobileNav items={items} name={name} />
        {/* Sidebar */}
        <aside className="hidden md:flex w-56 flex-shrink-0 flex-col h-screen sticky top-0 bg-sidebar border-r border-sidebar-border">
          {/* Logo */}
          <div className="px-6 py-7 border-b border-sidebar-border">
            <div className="text-[10px] font-semibold tracking-widest uppercase text-sidebar-foreground/40 mb-1">
              Actor Hub
            </div>
            <div className="text-xl font-light text-sidebar-foreground tracking-tight">
              {name}
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
            <div className="text-[10px] font-semibold tracking-widest uppercase text-sidebar-foreground/30 px-3 mb-2">
              Übersicht
            </div>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-150"
              >
                <span className="text-base w-4 text-center leading-none">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-5 py-5 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center text-xs font-semibold text-primary-foreground flex-shrink-0">
                {initialen}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-sidebar-foreground truncate">{name}</div>
                <div className="text-[10px] text-sidebar-foreground/40">Schauspieler:in</div>
              </div>
              {session && (
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                >
                  <button
                    type="submit"
                    className="text-sidebar-foreground/40 hover:text-sidebar-foreground text-xs transition"
                    title="Abmelden"
                  >
                    ⎋
                  </button>
                </form>
              )}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 pt-20 pb-8 md:px-10 md:py-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
