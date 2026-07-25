import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import RolleDetail from "./RolleDetail";
import SzenenBereich from "./SzenenBereich";

export default async function RollePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getUserId();

  const rolle = await prisma.role.findFirst({ where: { id, userId } });
  const szenen = await prisma.scene.findMany({ where: { roleId: id, userId }, orderBy: { createdAt: "asc" } });
  if (!rolle) notFound();

  return (
    <div>
      <Link href="/rollen" className="text-xs text-neutral-400 hover:text-neutral-700 transition">
        ← Alle Rollen
      </Link>
      <RolleDetail rolle={rolle} />
      <SzenenBereich roleId={rolle.id} szenen={szenen} />
    </div>
  );
}
