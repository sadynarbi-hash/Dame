"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createArticleStock(data: {
  nom: string; reference?: string; categorie: string; quantite: number;
  unite: string; seuilAlerte: number; prixAchat: number; fournisseur?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase.from("stock").insert({
    user_id: user.id, nom: data.nom, reference: data.reference,
    categorie: data.categorie, quantite: data.quantite, unite: data.unite,
    seuil_alerte: data.seuilAlerte, prix_achat: data.prixAchat, fournisseur: data.fournisseur,
  });
  if (error) return { error: error.message };
  revalidatePath("/stock");
  return { success: true };
}

export async function updateArticleStock(id: string, data: Partial<{
  nom: string; reference: string; categorie: string; quantite: number;
  unite: string; seuilAlerte: number; prixAchat: number; fournisseur: string;
}>) {
  const supabase = createClient();
  const { error } = await supabase.from("stock").update({
    nom: data.nom, reference: data.reference, categorie: data.categorie,
    quantite: data.quantite, unite: data.unite, seuil_alerte: data.seuilAlerte,
    prix_achat: data.prixAchat, fournisseur: data.fournisseur,
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/stock");
  return { success: true };
}

export async function ajusterQuantite(id: string, delta: number) {
  const supabase = createClient();
  const { data: article } = await supabase.from("stock").select("quantite").eq("id", id).single();
  if (!article) return { error: "Article introuvable" };

  const nouvelleQte = Math.max(0, article.quantite + delta);
  const { error } = await supabase.from("stock").update({ quantite: nouvelleQte }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/stock");
  return { success: true };
}

export async function deleteArticleStock(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("stock").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/stock");
  return { success: true };
}
