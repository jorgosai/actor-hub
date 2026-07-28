import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { auth, signOut } from "@/auth";
import { istAdmin } from "@/lib/admin";
import MobileNav from "@/components/MobileNav";
import { NAV_GRUPPEN, ADMIN_ITEM } from "@/components/nav-items";
import { Seitenleiste, AbmeldeKnopf } from "@/components/seitenleiste";
import { Lichtschein } from "@/components/lichtschein";
import { Suspense } from "react";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
/* Playfair Display trägt alle Anzeigetexte, Geist alles Funktionale. */
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const schriften = [geist, bricolage, playfair].map((f) => f.variable).join(" ");

export const metadata: Metadata = {
  title: "Actor Hub",
  description: "Karrieremanagement für Schauspieler:innen",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1c5847",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const adminSichtbar = session?.user?.id ? await istAdmin(session.user.id) : false;

  const gruppen = adminSichtbar
    ? NAV_GRUPPEN.map((g) =>
        g.titel === "Werkzeuge" ? { ...g, items: [...g.items, ADMIN_ITEM] } : g
      )
    : NAV_GRUPPEN;

  const name = session?.user?.name ?? "Actor Hub";
  const initialen = name
    .split(" ")
    .map((t) => t[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <html
      lang="de"
      className={`${schriften} bg-background`}
    >
      <body className="font-sans antialiased">
        <Suspense>
          <Lichtschein />
        </Suspense>
        <MobileNav
          gruppen={gruppen}
          name={name}
          abmelden={
            session ? (
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Abmelden
                </button>
              </form>
            ) : null
          }
        />

        {/* Seitenleiste */}
        <Suspense>
          <Seitenleiste
            gruppen={gruppen}
            name={name}
            initialen={initialen}
            abmelden={
              session ? (
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                >
                  <AbmeldeKnopf />
                </form>
              ) : null
            }
          />
        </Suspense>

        <main className="lg:pl-64">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-12 pt-20 sm:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
