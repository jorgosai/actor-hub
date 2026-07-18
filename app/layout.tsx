import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
  { href: "/bewerbungen", label: "Castings", icon: "◎" },
  { href: "/kontakte", label: "Kontakte", icon: "◉" },
  { href: "/projekte", label: "Projekte", icon: "▣" },
  { href: "/assistent", label: "KI-Assistent", icon: "✦" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full`}>
      <body className="h-full flex bg-background">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 flex flex-col h-screen sticky top-0 bg-sidebar border-r border-sidebar-border">
          {/* Logo */}
          <div className="px-6 py-7 border-b border-sidebar-border">
            <div className="text-[10px] font-semibold tracking-widest uppercase text-sidebar-foreground/40 mb-1">
              Actor Hub
            </div>
            <div className="text-xl font-light text-sidebar-foreground tracking-tight">
              Jorgos Stathis
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
            <div className="text-[10px] font-semibold tracking-widest uppercase text-sidebar-foreground/30 px-3 mb-2">
              Übersicht
            </div>
            {navItems.map((item) => (
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
                JS
              </div>
              <div>
                <div className="text-xs font-medium text-sidebar-foreground">Jorgos Stathis</div>
                <div className="text-[10px] text-sidebar-foreground/40">Schauspieler</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-10 py-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
