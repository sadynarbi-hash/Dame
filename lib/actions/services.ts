"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createService(data: {
  nom: string; description?: string; type: "service" | "article";
  prixHT: number; prixTTC: number; tva: number; categorie: string; actif: boolean; stockId?: string | null;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase.from("services").insert({
    user_id: user.id, nom: data.nom, description: data.description,
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
  const supabase = createClient();
  const { error } = await supabase.from("services").update({
    nom: data.nom, description: data.description, type: data.type,
    prix_ht: data.prixHT, prix_ttc: data.prixTTC, tva: data.tva,
    categorie: data.categorie, actif: data.actif, stock_id: data.stockId ?? null,
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/services");
  return { success: true };
}

export async function deleteService(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/services");
  return { success: true };
}
