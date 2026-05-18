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
  // Validate all inputs strictly
  if (!data.clientNom?.trim() || data.clientNom.length > 100) return { error: "Nom invalide" };
  if (!data.clientPrenom?.trim() || data.clientPrenom.length > 100) return { error: "Prénom invalide" };
  if (!data.clientTelephone?.trim() || data.clientTelephone.length > 30) return { error: "Téléphone invalide" };
  if (data.notes && data.notes.length > 1000) return { error: "Message trop long (max 1000 caractères)" };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || isNaN(new Date(data.date).getTime())) {
    return { error: "Date invalide" };
  }
  if (!/^\d{2}:\d{2}$/.test(data.heureDebut)) return { error: "Heure invalide" };
  if (!Array.isArray(data.serviceIds) || data.serviceIds.length > 20) return { error: "Services invalides" };

  const supabase = createServiceRoleClient();

  // Verify userId is a real active salon
  const { data: salon } = await supabase
    .from("entreprises").select("user_id").eq("user_id", userId).maybeSingle();
  if (!salon) return { error: "Salon introuvable" };

  // Verify serviceIds all belong to this salon (prevent cross-tenant injection)
  if (data.serviceIds.length > 0) {
    const { data: validServices } = await supabase
      .from("services").select("id").eq("user_id", userId).in("id", data.serviceIds);
    if (!validServices || validServices.length !== data.serviceIds.length) {
      return { error: "Services invalides" };
    }
  }

  const clientNomSanitized = data.clientNom.trim();
  const clientPrenomSanitized = data.clientPrenom.trim();
  const clientTelSanitized = data.clientTelephone.trim();
  const notesSanitized = data.notes?.trim() ?? "";

  const { data: rdv, error } = await supabase.from("rendez_vous").insert({
    user_id: userId,
    date: data.date,
    heure_debut: data.heureDebut,
    heure_fin: data.heureFin,
    statut: "en_attente",
    montant_estime: 0,
    notes: `${clientPrenomSanitized} ${clientNomSanitized} — ${clientTelSanitized}${notesSanitized ? "\n" + notesSanitized : ""}`,
  }).select("id").single();

  if (error || !rdv) return { error: "Erreur lors de la création du rendez-vous" };

  if (data.serviceIds.length > 0) {
    await supabase.from("rendez_vous_services").insert(
      data.serviceIds.map(sid => ({ rendez_vous_id: rdv.id, service_id: sid }))
    );
  }

  return { success: true };
}
