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

export async function entreeStockService(serviceId: string, quantite: number, prixAchat?: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: service } = await supabase.from("services").select("nom, stock_id").eq("id", serviceId).single();
  if (!service) return { error: "Article introuvable" };

  let stockId: string;

  if (service.stock_id) {
    const { data: stockItem } = await supabase.from("stock").select("quantite").eq("id", service.stock_id).single();
    if (!stockItem) return { error: "Stock introuvable" };
    const update: Record<string, unknown> = { quantite: stockItem.quantite + quantite };
    if (prixAchat !== undefined && prixAchat >= 0) update.prix_achat = prixAchat;
    const { error } = await supabase.from("stock").update(update).eq("id", service.stock_id);
    if (error) return { error: error.message };
    stockId = service.stock_id;
  } else {
    const { data: newStock, error: errStock } = await supabase.from("stock").insert({
      user_id: user.id, nom: service.nom, categorie: "Article",
      quantite, unite: "unité", seuil_alerte: 3, prix_achat: prixAchat ?? 0,
    }).select("id").single();
    if (errStock || !newStock) return { error: errStock?.message ?? "Erreur création stock" };
    const { error: errLink } = await supabase.from("services").update({ stock_id: newStock.id }).eq("id", serviceId);
    if (errLink) return { error: errLink.message };
    stockId = newStock.id;
  }

  // Enregistrer le mouvement d'entrée
  await supabase.from("mouvements_stock").insert({
    user_id: user.id,
    stock_id: stockId,
    article_nom: service.nom,
    type: "entree",
    quantite,
    prix_unitaire: prixAchat ?? 0,
  });

  revalidatePath("/stock");
  revalidatePath("/services");
  return { success: true };
}

export async function deleteArticleStock(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("stock").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/stock");
  return { success: true };
}
