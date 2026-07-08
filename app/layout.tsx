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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full`}>
      <body className="h-full flex">
        <aside className="w-64 bg-neutral-900 text-white flex flex-col p-6 gap-2">
          <h1 className="text-xl font-bold mb-6">Actor Hub</h1>
          <Link href="/bewerbungen" className="px-3 py-2 rounded hover:bg-neutral-700 transition">
            Bewerbungen
          </Link>
          <Link href="/kontakte" className="px-3 py-2 rounded hover:bg-neutral-700 transition">
            Kontakte
          </Link>
          <Link href="/projekte" className="px-3 py-2 rounded hover:bg-neutral-700 transition">
            Projekte
          </Link>
        </aside>
        <main className="flex-1 p-8 bg-neutral-50 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}