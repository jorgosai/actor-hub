import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import JournalClient from "./JournalClient";
import { SeitenKopf } from "@/components/seiten-kopf";

export default async function JournalPage() {
  const userId = await getUserId();
  const eintraege = await prisma.journalEntry.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return (
    <>
      <SeitenKopf
        eyebrow="Entwicklung"
        titel="Journal"
        beschreibung={
          eintraege.length > 0
            ? `${eintraege.length} ${eintraege.length === 1 ? "Eintrag" : "Einträge"} — was gut lief, was nicht, und was du daraus mitnimmst.`
            : "Nach jedem Casting kurz festhalten, was lief. Nach einem Jahr siehst du Muster."
        }
      />
      <JournalClient eintraege={eintraege} />
    </>
  );
}
