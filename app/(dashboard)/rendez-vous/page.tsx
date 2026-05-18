import { getDataContext } from "@/lib/auth/context";
import { RendezVousClient } from "@/components/rendez-vous/RendezVousClient";
import { LienReservation } from "@/components/rendez-vous/LienReservation";
import { redirect } from "next/navigation";

export default async function RendezVousPage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const [{ data: rdv }, { data: clients }, { data: services }, { data: entreprise }] = await Promise.all([
    db.from("rendez_vous").select("*, client:clients(id, nom, prenom), services:rendez_vous_services(service_id)").eq("user_id", userId).order("date"),
    db.from("clients").select("id, nom, prenom").eq("user_id", userId).order("nom"),
    db.from("services").select("id, nom, prix_ttc").eq("user_id", userId).eq("type", "service").eq("actif", true).order("nom"),
    db.from("entreprises").select("nom").eq("user_id", userId).single(),
  ]);

  return (
    <div className="space-y-4">
      <LienReservation userId={userId} nomSalon={entreprise?.nom ?? "notre salon"} />
      <RendezVousClient initialRdv={rdv ?? []} clients={clients ?? []} services={services ?? []} />
    </div>
  );
}
