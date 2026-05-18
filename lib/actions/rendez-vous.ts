"use server";

import { revalidatePath } from "next/cache";
import { getDataContext } from "@/lib/auth/context";
import type { StatutRendezVous } from "@/types";

export async function createRendezVous(data: {
  clientId: string; serviceIds: string[]; date: string;
  heureDebut: string; heureFin: string; statut: StatutRendezVous;
  montantEstime: number; notes?: string;
}) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { data: rdv, error } = await db.from("rendez_vous").insert({
    user_id: userId, client_id: data.clientId,
    date: data.date, heure_debut: data.heureDebut, heure_fin: data.heureFin,
    statut: data.statut, montant_estime: data.montantEstime, notes: data.notes,
  }).select().single();

  if (error) return { error: error.message };

  if (data.serviceIds.length > 0) {
    await db.from("rendez_vous_services").insert(
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
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const update: Record<string, unknown> = {};
  if (data.clientId !== undefined) update.client_id = data.clientId;
  if (data.date !== undefined) update.date = data.date;
  if (data.heureDebut !== undefined) update.heure_debut = data.heureDebut;
  if (data.heureFin !== undefined) update.heure_fin = data.heureFin;
  if (data.statut !== undefined) update.statut = data.statut;
  if (data.montantEstime !== undefined) update.montant_estime = data.montantEstime;
  if (data.notes !== undefined) update.notes = data.notes;

  const { error } = await db.from("rendez_vous").update(update).eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };

  if (data.serviceIds !== undefined) {
    await db.from("rendez_vous_services").delete().eq("rendez_vous_id", id);
    if (data.serviceIds.length > 0) {
      await db.from("rendez_vous_services").insert(
        data.serviceIds.map((sid) => ({ rendez_vous_id: id, service_id: sid }))
      );
    }
  }

  revalidatePath("/rendez-vous");
  return { success: true };
}

export async function deleteRendezVous(id: string) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("rendez_vous").delete().eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/rendez-vous");
  return { success: true };
}
