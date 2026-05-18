import { getDataContext } from "@/lib/auth/context";
import { NouvelleFactureForm } from "@/components/factures/NouvelleFactureForm";
import { redirect } from "next/navigation";

export default async function NouvelleFacturePage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const [{ data: clients }, { data: services }, { data: agents }] = await Promise.all([
    db.from("clients").select("id, nom, prenom, telephone").eq("user_id", userId).order("nom"),
    db.from("services").select("id, nom, prix_ht, prix_ttc, tva, type").eq("user_id", userId).eq("actif", true).order("nom"),
    db.from("agents").select("id, nom").eq("user_id", userId).eq("actif", true).order("nom"),
  ]);

  return <NouvelleFactureForm clients={clients ?? []} services={services ?? []} agents={agents ?? []} />;
}
