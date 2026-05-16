import { createClient } from "@/lib/supabase/server";
import { RendezVousClient } from "@/components/rendez-vous/RendezVousClient";

export default async function RendezVousPage() {
  const supabase = createClient();
  const [{ data: rdv }, { data: clients }, { data: services }] = await Promise.all([
    supabase.from("rendez_vous").select("*, client:clients(id, nom, prenom), services:rendez_vous_services(service_id)").order("date"),
    supabase.from("clients").select("id, nom, prenom").order("nom"),
    supabase.from("services").select("id, nom, prix_ttc").eq("type", "service").eq("actif", true).order("nom"),
  ]);
  return <RendezVousClient initialRdv={rdv ?? []} clients={clients ?? []} services={services ?? []} />;
}
