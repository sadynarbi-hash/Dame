import { createClient } from "@/lib/supabase/server";
import { NouvelleFactureForm } from "@/components/factures/NouvelleFactureForm";

export default async function NouvelleFacturePage() {
  const supabase = createClient();
  const [{ data: clients }, { data: services }] = await Promise.all([
    supabase.from("clients").select("id, nom, prenom, telephone").order("nom"),
    supabase.from("services").select("id, nom, prix_ht, prix_ttc, tva, type").eq("actif", true).order("nom"),
  ]);

  return <NouvelleFactureForm clients={clients ?? []} services={services ?? []} />;
}
