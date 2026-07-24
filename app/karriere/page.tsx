import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import KarriereClient from "./KarriereClient";

export default async function KarrierePage() {
  const userId = await getUserId();
  const [ziele, wuensche] = await Promise.all([
    prisma.goal.findMany({ where: { userId }, orderBy: [{ done: "asc" }, { createdAt: "desc" }] }),
    prisma.wish.findMany({ where: { userId }, orderBy: [{ achieved: "asc" }, { createdAt: "desc" }] }),
  ]);

  const erreicht = ziele.filter((z) => z.done).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Karriere</h1>
        {ziele.length > 0 && (
          <p className="text-sm text-neutral-500">
            {erreicht} von {ziele.length} Zielen erreicht
          </p>
        )}
      </div>
      <KarriereClient ziele={ziele} wuensche={wuensche} />
    </div>
  );
}
