import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import KarriereClient from "./KarriereClient";
import { SeitenKopf } from "@/components/seiten-kopf";

export default async function KarrierePage() {
  const userId = await getUserId();
  const [ziele, wuensche] = await Promise.all([
    prisma.goal.findMany({ where: { userId }, orderBy: [{ done: "asc" }, { createdAt: "desc" }] }),
    prisma.wish.findMany({ where: { userId }, orderBy: [{ achieved: "asc" }, { createdAt: "desc" }] }),
  ]);

  const erreicht = ziele.filter((z) => z.done).length;

  return (
    <>
      <SeitenKopf
        eyebrow="Entwicklung"
        titel="Ziele"
        beschreibung={
          ziele.length > 0
            ? `${erreicht} von ${ziele.length} Zielen erreicht — dazu deine Wunschliste.`
            : "Wo willst du in einem Jahr stehen, wo in fünf? Und was steht auf deiner Wunschliste?"
        }
      />
      <KarriereClient ziele={ziele} wuensche={wuensche} />
    </>
  );
}
