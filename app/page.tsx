import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import Link from "next/link";

const STATUS_FARBEN: Record<string, { bg: string; text: string; dot: string }> = {
  Anfrage:     { bg: "bg-neutral-100", text: "text-neutral-600", dot: "bg-neutral-400" },
  Beworben:    { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400" },
  "Self Tape": { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
  Recall:      { bg: "bg-teal-50",    text: "text-teal-700",    dot: "bg-teal-400" },
  Callback:    { bg: "bg-violet-50",  text: "text-violet-700",  dot: "bg-violet-400" },
  Gebucht:     { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  Abgesagt:    { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400" },
};

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

export default async function Home() {
  const userId = await getUserId();
  const [bewerbungen, kontakteCount, projekte, aufgaben, pflegeKontakte, termine] = await Promise.all([
    prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { contact: true },
    }),
    prisma.contact.count({ where: { userId } }),
    prisma.project.findMany({ where: { userId, status: "Laufend" } }),
    prisma.task.findMany({
      where: { userId, done: false },
      orderBy: { dueDate: { sort: "asc", nulls: "last" } },
    }),
    prisma.contact.findMany({
      where: { userId },
      orderBy: { lastContact: { sort: "asc", nulls: "first" } },
      take: 3,
    }),
    prisma.event.findMany({
      where: {
        userId,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(0, 0, 0, 0) + 2 * 86400000),
        },
      },
      orderBy: { date: "asc" },
    }),
  ]);

  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  const in7Tagen = new Date(heute.getTime() + 7 * 86400000);

  const aktive = bewerbungen.filter((b) => b.status !== "Gebucht" && b.status !== "Abgesagt");

  const faelligeFollowUps = aktive.filter(
    (b) => b.followUpAt && new Date(b.followUpAt) <= heute
  );
  const naheDeadlines = aktive.filter(
    (b) => b.deadline && new Date(b.deadline) >= heute && new Date(b.deadline) <= in7Tagen
  );

  const faelligeAufgaben = aufgaben.filter(
    (a) => a.dueDate && new Date(a.dueDate) <= heute
  );

  const vor90Tagen = new Date(heute.getTime() - 90 * 86400000);
  const pflegeFaellig = pflegeKontakte.filter(
    (k) => !k.lastContact || new Date(k.lastContact) < vor90Tagen
  );

  const letzte = bewerbungen.slice(0, 5);

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
          Dashboard
        </p>
        <h1 className="text-3xl font-light tracking-tight text-foreground mb-1">
          Willkommen zurück.
        </h1>
        <p className="text-muted-foreground text-sm">
          {aktive.length} aktive Castings · {projekte.length} laufende Projekte
        </p>
      </div>

      {/* Heute wichtig */}
      {(faelligeFollowUps.length > 0 || naheDeadlines.length > 0 || faelligeAufgaben.length > 0 || termine.length > 0) && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-foreground tracking-tight mb-4">
            Heute wichtig
          </h2>
          <div className="space-y-2">
            {termine.map((t) => {
              const d = new Date(t.date);
              const istHeute = d.toDateString() === new Date().toDateString();
              const hatUhrzeit = d.getHours() !== 0 || d.getMinutes() !== 0;
              return (
                <Link key={`e-${t.id}`} href="/kalender" className="block">
                  <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-3.5 flex items-center justify-between hover:border-violet-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-base">▤</span>
                      <div>
                        <p className="text-sm font-medium text-violet-900">
                          {istHeute ? "Heute" : "Morgen"}
                          {hatUhrzeit ? ` ${d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}` : ""}: {t.title}
                        </p>
                        <p className="text-xs text-violet-700/70">
                          {t.type}
                          {t.location ? ` · ${t.location}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-violet-400">→</span>
                  </div>
                </Link>
              );
            })}
            {naheDeadlines.map((b) => (
              <Link key={`d-${b.id}`} href="/bewerbungen" className="block">
                <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3.5 flex items-center justify-between hover:border-red-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base">⏱</span>
                    <div>
                      <p className="text-sm font-medium text-red-900">
                        Deadline {formatDate(b.deadline!)}: {b.role}
                      </p>
                      <p className="text-xs text-red-700/70">{b.production} · Status: {b.status}</p>
                    </div>
                  </div>
                  <span className="text-xs text-red-400">→</span>
                </div>
              </Link>
            ))}
            {faelligeAufgaben.map((a) => (
              <Link key={`t-${a.id}`} href="/aufgaben" className="block">
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex items-center justify-between hover:border-amber-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base">☑</span>
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        Aufgabe fällig: {a.title}
                      </p>
                      <p className="text-xs text-amber-700/70">
                        Fällig am {formatDate(a.dueDate!)}
                        {a.priority === "Hoch" ? " · Priorität hoch" : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400">→</span>
                </div>
              </Link>
            ))}
            {faelligeFollowUps.map((b) => (
              <Link key={`f-${b.id}`} href="/bewerbungen" className="block">
                <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3.5 flex items-center justify-between hover:border-orange-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base">↩</span>
                    <div>
                      <p className="text-sm font-medium text-orange-900">
                        Follow-up fällig: {b.role} — {b.production}
                      </p>
                      <p className="text-xs text-orange-700/70">
                        {b.contact ? `Kontakt: ${b.contact.name}` : `Geplant für ${formatDate(b.followUpAt!)}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-orange-400">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Kontaktpflege */}
      {pflegeFaellig.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-foreground tracking-tight mb-4">
            Kontaktpflege
          </h2>
          <div className="space-y-2">
            {pflegeFaellig.map((k) => {
              const tage = k.lastContact
                ? Math.floor((Date.now() - new Date(k.lastContact).getTime()) / 86400000)
                : null;
              return (
                <Link key={k.id} href="/kontakte" className="block">
                  <div className="bg-card border border-border rounded-xl px-5 py-3.5 flex items-center justify-between hover:border-primary/40 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{k.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {k.category}
                        {k.company ? ` · ${k.company}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-orange-600 font-medium">
                      {tage === null ? "Noch nie kontaktiert" : `Vor ${tage} Tagen`}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { href: "/bewerbungen", label: "Aktive Castings", value: aktive.length },
          { href: "/kontakte", label: "Kontakte", value: kontakteCount },
          { href: "/projekte", label: "Laufende Projekte", value: projekte.length },
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

      {/* Letzte Castings */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-foreground tracking-tight">Letzte Castings</h2>
          <Link href="/bewerbungen" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Alle ansehen →
          </Link>
        </div>

        {letzte.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <p className="text-muted-foreground text-sm">Noch keine Castings.</p>
            <Link href="/bewerbungen" className="text-xs text-primary mt-2 inline-block hover:underline">
              Erstes Casting eintragen →
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {letzte.map((b, i) => {
              const f = STATUS_FARBEN[b.status] ?? { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground/40" };
              return (
                <div
                  key={b.id}
                  className={`flex items-center justify-between px-6 py-4 ${i !== letzte.length - 1 ? "border-b border-border" : ""}`}
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
