import { auth } from "@/auth";

// Liefert die User-ID der aktuellen Session oder wirft einen Fehler.
export async function getUserId(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new Error("Nicht eingeloggt");
  return id;
}
