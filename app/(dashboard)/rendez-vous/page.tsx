import { createClient } from "@/lib/supabase/server";
import { RendezVousClient } from "@/components/rendez-vous/RendezVousClient";
import { LienReservation } from "@/components/rendez-vous/LienReservation";

export default async function RendezVousPage() {
  const supabase = createClient();
  const [{ data: { user } }, { data: rdv }, { data: clients }, { data: services }, { data: entreprise }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("rendez_vous").select("*, client:clients(id, nom, prenom), services:rendez_vous_services(service_id)").order("date"),
    supabase.from("clients").select("id, nom, prenom").order("nom"),
    supabase.from("services").select("id, nom, prix_ttc").eq("type", "service").eq("actif", true).order("nom"),
    supabase.from("entreprises").select("nom").single(),
  ]);
  return (
    <div className="space-y-4">
      {user && <LienReservation userId={user.id} nomSalon={entreprise?.nom ?? "notre salon"} />}
      <RendezVousClient initialRdv={rdv ?? []} clients={clients ?? []} services={services ?? []} />
    </div>
  );
}
