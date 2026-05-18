import { getDataContext } from "@/lib/auth/context";
import { ParametresClient } from "@/components/parametres/ParametresClient";
import { redirect } from "next/navigation";

export default async function ParametresPage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const { data: entreprise } = await db.from("entreprises").select("*").eq("user_id", userId).single();
  return <ParametresClient initialEntreprise={entreprise} />;
}
