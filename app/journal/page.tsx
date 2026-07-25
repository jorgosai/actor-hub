import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import JournalClient from "./JournalClient";

export default async function JournalPage() {
  const userId = await getUserId();
  const eintraege = await prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Journal</h1>
        <p className="text-sm text-neutral-500">{eintraege.length} Einträge</p>
      </div>
      <JournalClient eintraege={eintraege} />
    </div>
  );
}
