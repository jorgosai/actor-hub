import { prisma } from "@/lib/db";
import Link from "next/link";

const STATUS_FARBEN: Record<string, { bg: string; text: string; dot: string }> = {
  Beworben:   { bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-400" },
  Eingeladen: { bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400" },
  Callback:   { bg: "bg-violet-50",  text: "text-violet-700", dot: "bg-violet-400" },
  Angenommen: { bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-400" },
  Abgesagt:   { bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-400" },
};

export default async function Home() {
  const [bewerbungen, kontakteCount, projekte] = await Promise.all([
    prisma.application.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.contact.count(),
    prisma.project.findMany({ where: { status: "Laufend" } }),
  ]);

  const offen = bewerbungen.filter(
    (b) => b.status !== "Angenommen" && b.status !== "Abgesagt"
  );

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
          Dashboard
        </p>
        <h1 className="text-3xl font-light tracking-tight text-foreground mb-1">
          Guten Morgen, Jorgos.
        </h1>
        <p className="text-muted-foreground text-sm">
          {offen.length} offene Bewerbungen · {projekte.length} laufende Projekte
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { href: "/bewerbungen", label: "Offene Castings", value: offen.length },
          { href: "/kontakte",    label: "Kontakte",        value: kontakteCount },
          { href: "/projekte",    label: "Laufende Projekte", value: projekte.length },
        ].map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-pointer group">
              <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground mb-4">
                {stat.label}
              </p>
              <p className="text-5xl font-light text-foreground tracking-tight mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                Alle ansehen →
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-foreground tracking-tight">Letzte Bewerbungen</h2>
          <Link href="/bewerbungen" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Alle ansehen →
          </Link>
        </div>

        {bewerbungen.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <p className="text-muted-foreground text-sm">Noch keine Bewerbungen.</p>
            <Link href="/bewerbungen" className="text-xs text-primary mt-2 inline-block hover:underline">
              Erste Bewerbung eintragen →
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {bewerbungen.map((b, i) => {
              const f = STATUS_FARBEN[b.status] ?? { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground/40" };
              return (
                <div
                  key={b.id}
                  className={`flex items-center justify-between px-6 py-4 ${i !== bewerbungen.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${f.dot}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{b.role}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{b.production}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${f.bg} ${f.text}`}>
                    {b.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
