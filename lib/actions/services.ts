"use server";

import { revalidatePath } from "next/cache";
import { getDataContext } from "@/lib/auth/context";

export async function createService(data: {
  nom: string; description?: string; type: "service" | "article";
  prixHT: number; prixTTC: number; tva: number; categorie: string; actif: boolean; stockId?: string | null;
}) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("services").insert({
    user_id: userId, nom: data.nom, description: data.description,
    type: data.type, prix_ht: data.prixHT, prix_ttc: data.prixTTC,
    tva: data.tva, categorie: data.categorie, actif: data.actif,
    stock_id: data.stockId ?? null,
  });
  if (error) return { error: error.message };
  revalidatePath("/services");
  return { success: true };
}

export async function updateService(id: string, data: Partial<{
  nom: string; description: string; type: "service" | "article";
  prixHT: number; prixTTC: number; tva: number; categorie: string; actif: boolean; stockId: string | null;
}>) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("services").update({
    nom: data.nom, description: data.description, type: data.type,
    prix_ht: data.prixHT, prix_ttc: data.prixTTC, tva: data.tva,
    categorie: data.categorie, actif: data.actif, stock_id: data.stockId ?? null,
  }).eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/services");
  return { success: true };
}

export async function deleteService(id: string) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("services").delete().eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/services");
  return { success: true };
}
