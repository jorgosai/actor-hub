import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { auth } from "@/auth";

import { DashboardHeader } from "@/components/dashboard/header";
import { Tagesueberblick } from "@/components/dashboard/tagesueberblick";
import { StatCards, type Kennzahl } from "@/components/dashboard/stat-cards";
import { CastingPipeline } from "@/components/dashboard/casting-pipeline";
import { RecallRing } from "@/components/dashboard/recall-ring";
import { HeuteWichtig, type Eintrag } from "@/components/dashboard/heute-wichtig";
import { RecentCastings, type CastingZeile } from "@/components/dashboard/recent-castings";

const PIPELINE = ["Anfrage", "Beworben", "Self Tape", "Recall", "Callback", "Gebucht"];
const AB_RECALL = ["Recall", "Callback", "Gebucht"];
const PFLEGE_TAGE = 90;

const tag = (d: Date) =>
  new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "short" });
const uhr = (d: Date) =>
  new Date(d).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

function initialen(text: string): string {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default async function Home() {
  const userId = await getUserId();
  const session = await auth();
  const vorname = (session?.user?.name ?? "").split(" ")[0] || "Willkommen";

  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  const in2Tagen = new Date(heute.getTime() + 2 * 86400000);
  const in7Tagen = new Date(heute.getTime() + 7 * 86400000);
  const vor90Tagen = new Date(heute.getTime() - PFLEGE_TAGE * 86400000);

  const [castings, kontakte, pflegeKontakte, projekte, rollen, aufgaben, termine] =
    await Promise.all([
      prisma.application.findMany({
        where: { userId },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: { contact: true },
      }),
      prisma.contact.count({ where: { userId } }),
      prisma.contact.count({
        where: { userId, OR: [{ lastContact: null }, { lastContact: { lt: vor90Tagen } }] },
      }),
      prisma.project.count({ where: { userId, status: "Laufend" } }),
      prisma.role.count({ where: { userId, status: "In Arbeit" } }),
      prisma.task.findMany({
        where: { userId, done: false },
        orderBy: { dueDate: { sort: "asc", nulls: "last" } },
      }),
      prisma.event.findMany({
        where: { userId, date: { gte: heute, lt: in2Tagen } },
        orderBy: { date: "asc" },
      }),
    ]);

  const aktive = castings.filter((c) => c.status !== "Gebucht" && c.status !== "Abgesagt");
  const neuDieseWoche = aktive.filter(
    (c) => c.createdAt >= new Date(heute.getTime() - 7 * 86400000)
  ).length;

  // ── Recall-Quote ─────────────────────────────────────────────
  const bisRecall = castings.filter((c) => AB_RECALL.includes(c.status)).length;
  const quote = castings.length > 0 ? Math.round((bisRecall / castings.length) * 100) : 0;

  // ── Pipeline ─────────────────────────────────────────────────
  const stufen = PIPELINE.map((label) => ({
    label,
    anzahl: castings.filter((c) => c.status === label).length,
  }));

  // ── Heute wichtig ────────────────────────────────────────────
  const eintraege: Eintrag[] = [];

  for (const t of termine) {
    const d = new Date(t.date);
    const istHeute = d.toDateString() === new Date().toDateString();
    const mitZeit = d.getHours() !== 0 || d.getMinutes() !== 0;
    eintraege.push({
      id: `e-${t.id}`,
      titel: t.title,
      unterzeile: [t.type, t.location].filter(Boolean).join(" · "),
      marke: mitZeit ? uhr(d) : istHeute ? "Heute" : "Morgen",
      href: "/kalender",
      art: "termin",
    });
  }

  for (const c of aktive) {
    if (c.deadline && new Date(c.deadline) >= heute && new Date(c.deadline) <= in7Tagen) {
      eintraege.push({
        id: `d-${c.id}`,
        titel: `Deadline: ${c.role}`,
        unterzeile: `${c.production} · ${c.status}`,
        marke: tag(c.deadline),
        href: "/bewerbungen",
        dringend: true,
        art: "deadline",
      });
    }
    if (c.followUpAt && new Date(c.followUpAt) <= heute) {
      eintraege.push({
        id: `f-${c.id}`,
        titel: `Follow-up: ${c.role}`,
        unterzeile: c.contact ? `${c.contact.name} · ${c.production}` : c.production,
        marke: "fällig",
        href: "/bewerbungen",
        dringend: true,
        art: "followup",
      });
    }
  }

  for (const a of aufgaben) {
    if (a.dueDate && new Date(a.dueDate) <= heute) {
      eintraege.push({
        id: `t-${a.id}`,
        titel: a.title,
        unterzeile: a.priority === "Hoch" ? "Aufgabe · Priorität hoch" : "Aufgabe",
        marke: new Date(a.dueDate) < heute ? "überfällig" : "heute",
        href: "/aufgaben",
        dringend: new Date(a.dueDate) < heute,
        art: "aufgabe",
      });
    }
  }

  const wichtig = eintraege.slice(0, 5);

  // ── Aufmacher-Text (regelbasiert, kein KI-Aufruf) ────────────
  let kernsatz: string;
  const ersterTermin = termine[0];
  const naechsteDeadline = aktive
    .filter((c) => c.deadline && new Date(c.deadline) >= heute)
    .sort((a, b) => +new Date(a.deadline!) - +new Date(b.deadline!))[0];
  const offeneFollowUps = aktive.filter(
    (c) => c.followUpAt && new Date(c.followUpAt) <= heute
  ).length;

  if (ersterTermin) {
    const d = new Date(ersterTermin.date);
    const wann = d.toDateString() === new Date().toDateString() ? "Heute" : "Morgen";
    const zeit = d.getHours() !== 0 || d.getMinutes() !== 0 ? ` um ${uhr(d)}` : "";
    kernsatz = `${wann}${zeit}: ${ersterTermin.title}. Plan dir vorher genug Zeit zur Vorbereitung ein.`;
  } else if (naechsteDeadline) {
    kernsatz = `Deine nächste Deadline ist am ${tag(naechsteDeadline.deadline!)} für „${naechsteDeadline.role}“ in ${naechsteDeadline.production}.`;
  } else if (offeneFollowUps > 0) {
    kernsatz = `${offeneFollowUps} ${offeneFollowUps === 1 ? "Casting wartet" : "Castings warten"} auf ein Follow-up. Eine kurze Nachricht hält die Beziehung am Leben.`;
  } else if (aktive.length > 0) {
    kernsatz = `${aktive.length} ${aktive.length === 1 ? "Casting läuft" : "Castings laufen"} gerade. Nichts ist überfällig — guter Moment für Rollenarbeit.`;
  } else {
    kernsatz = "Noch keine laufenden Castings. Trag deine erste Bewerbung ein, dann füllt sich das Dashboard.";
  }

  const teile: string[] = [];
  if (pflegeKontakte > 0)
    teile.push(`${pflegeKontakte} Kontakte hattest du seit über drei Monaten nicht`);
  if (rollen > 0) teile.push(`${rollen} ${rollen === 1 ? "Rolle ist" : "Rollen sind"} in Arbeit`);
  if (projekte > 0) teile.push(`${projekte} ${projekte === 1 ? "Projekt läuft" : "Projekte laufen"}`);
  const zusatz = teile.length > 0 ? teile.join(", ") + "." : "";

  // ── Kennzahlen ───────────────────────────────────────────────
  const kennzahlen: Kennzahl[] = [
    {
      wert: String(aktive.length),
      label: "Aktive Castings",
      zusatz:
        neuDieseWoche > 0 && neuDieseWoche < aktive.length
          ? `+${neuDieseWoche} diese Woche`
          : undefined,
      href: "/bewerbungen",
      ton: "sky",
      icon: "castings",
    },
    {
      wert: `${quote}%`,
      label: "Recall-Quote",
      zusatz: castings.length > 0 ? `${bisRecall} von ${castings.length}` : undefined,
      href: "/bewerbungen",
      ton: "mint",
      icon: "recall",
    },
    {
      wert: String(kontakte),
      label: "Kontakte",
      zusatz: pflegeKontakte > 0 ? `${pflegeKontakte} fällig` : undefined,
      href: "/kontakte",
      ton: "peach",
      icon: "kontakte",
    },
    {
      wert: String(rollen),
      label: "Rollen in Arbeit",
      href: "/rollen",
      ton: "butter",
      icon: "rollen",
    },
  ];

  const letzte: CastingZeile[] = castings.slice(0, 4).map((c) => ({
    id: c.id,
    rolle: c.role,
    produktion: c.production,
    initialen: initialen(c.role),
    status: c.status,
  }));

  return (
    <>
      <DashboardHeader vorname={vorname} />
      <Tagesueberblick kernsatz={kernsatz} zusatz={zusatz} />
      <StatCards kennzahlen={kennzahlen} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CastingPipeline stufen={stufen} gesamt={castings.length} />
        </div>
        <div className="lg:col-span-1">
          <RecallRing prozent={quote} erreicht={bisRecall} gesamt={castings.length} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HeuteWichtig eintraege={wichtig} />
        <RecentCastings castings={letzte} />
      </div>
    </>
  );
}
