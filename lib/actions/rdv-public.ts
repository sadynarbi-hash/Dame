"use server";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function getSalonPublic(userId: string) {
  const supabase = createServiceRoleClient();
  const [{ data: entreprise }, { data: services }] = await Promise.all([
    supabase.from("entreprises").select("nom, adresse, telephone, email, logo, couleur_principale").eq("user_id", userId).single(),
    supabase.from("services").select("id, nom, prix_ttc, categorie").eq("user_id", userId).eq("type", "service").eq("actif", true).order("categorie").order("nom"),
  ]);
  return { entreprise, services: services ?? [] };
}

export async function creerRdvPublic(userId: string, data: {
  clientNom: string;
  clientPrenom: string;
  clientTelephone: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  serviceIds: string[];
  notes?: string;
}) {
  if (!data.clientNom || !data.date || !data.heureDebut) {
    return { error: "Champs obligatoires manquants" };
  }

  const supabase = createServiceRoleClient();

  const { data: rdv, error } = await supabase.from("rendez_vous").insert({
    user_id: userId,
    date: data.date,
    heure_debut: data.heureDebut,
    heure_fin: data.heureFin,
    statut: "en_attente",
    montant_estime: 0,
    notes: `${data.clientPrenom} ${data.clientNom} — ${data.clientTelephone}${data.notes ? "\n" + data.notes : ""}`,
  }).select("id").single();

  if (error || !rdv) return { error: error?.message ?? "Erreur lors de la création" };

  if (data.serviceIds.length > 0) {
    await supabase.from("rendez_vous_services").insert(
      data.serviceIds.map(sid => ({ rendez_vous_id: rdv.id, service_id: sid }))
    );
  }

  return { success: true };
}
