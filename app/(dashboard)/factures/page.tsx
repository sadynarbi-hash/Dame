import { getDataContext } from "@/lib/auth/context";
import { FacturesClient } from "@/components/factures/FacturesClient";
import { redirect } from "next/navigation";

export default async function FacturesPage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const { data: factures } = await db
    .from("factures")
    .select("*, client:clients(id, nom, prenom)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return <FacturesClient initialFactures={factures ?? []} />;
}
