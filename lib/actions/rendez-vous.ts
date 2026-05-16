"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StatutRendezVous } from "@/types";

export async function createRendezVous(data: {
  clientId: string; serviceIds: string[]; date: string;
  heureDebut: string; heureFin: string; statut: StatutRendezVous;
  montantEstime: number; notes?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: rdv, error } = await supabase.from("rendez_vous").insert({
    user_id: user.id, client_id: data.clientId,
    date: data.date, heure_debut: data.heureDebut, heure_fin: data.heureFin,
    statut: data.statut, montant_estime: data.montantEstime, notes: data.notes,
  }).select().single();

  if (error) return { error: error.message };

  if (data.serviceIds.length > 0) {
    await supabase.from("rendez_vous_services").insert(
      data.serviceIds.map((sid) => ({ rendez_vous_id: rdv.id, service_id: sid }))
    );
  }

  revalidatePath("/rendez-vous");
  return { success: true };
}

export async function updateRendezVous(id: string, data: Partial<{
  clientId: string; serviceIds: string[]; date: string; heureDebut: string;
  heureFin: string; statut: StatutRendezVous; montantEstime: number; notes: string;
}>) {
  const supabase = createClient();
  const update: Record<string, unknown> = {};
  if (data.clientId !== undefined) update.client_id = data.clientId;
  if (data.date !== undefined) update.date = data.date;
  if (data.heureDebut !== undefined) update.heure_debut = data.heureDebut;
  if (data.heureFin !== undefined) update.heure_fin = data.heureFin;
  if (data.statut !== undefined) update.statut = data.statut;
  if (data.montantEstime !== undefined) update.montant_estime = data.montantEstime;
  if (data.notes !== undefined) update.notes = data.notes;

  const { error } = await supabase.from("rendez_vous").update(update).eq("id", id);
  if (error) return { error: error.message };

  if (data.serviceIds !== undefined) {
    await supabase.from("rendez_vous_services").delete().eq("rendez_vous_id", id);
    if (data.serviceIds.length > 0) {
      await supabase.from("rendez_vous_services").insert(
        data.serviceIds.map((sid) => ({ rendez_vous_id: id, service_id: sid }))
      );
    }
  }

  revalidatePath("/rendez-vous");
  return { success: true };
}

export async function deleteRendezVous(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("rendez_vous").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/rendez-vous");
  return { success: true };
}
