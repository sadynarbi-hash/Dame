"use server";

import { revalidatePath } from "next/cache";
import { getDataContext } from "@/lib/auth/context";

export async function createArticleStock(data: {
  nom: string; reference?: string; categorie: string; quantite: number;
  unite: string; seuilAlerte: number; prixAchat: number; fournisseur?: string;
}) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("stock").insert({
    user_id: userId, nom: data.nom, reference: data.reference,
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
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("stock").update({
    nom: data.nom, reference: data.reference, categorie: data.categorie,
    quantite: data.quantite, unite: data.unite, seuil_alerte: data.seuilAlerte,
    prix_achat: data.prixAchat, fournisseur: data.fournisseur,
  }).eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/stock");
  return { success: true };
}

export async function ajusterQuantite(id: string, delta: number) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { data: article } = await db.from("stock").select("quantite").eq("id", id).eq("user_id", userId).single();
  if (!article) return { error: "Article introuvable" };

  const nouvelleQte = Math.max(0, article.quantite + delta);
  const { error } = await db.from("stock").update({ quantite: nouvelleQte }).eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/stock");
  return { success: true };
}

export async function entreeStockService(serviceId: string, quantite: number, prixAchat?: number) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { data: service } = await db.from("services").select("nom, stock_id").eq("id", serviceId).eq("user_id", userId).single();
  if (!service) return { error: "Article introuvable" };

  let stockId: string;

  if (service.stock_id) {
    const { data: stockItem } = await db.from("stock").select("quantite").eq("id", service.stock_id).single();
    if (!stockItem) return { error: "Stock introuvable" };
    const update: Record<string, unknown> = { quantite: stockItem.quantite + quantite };
    if (prixAchat !== undefined && prixAchat >= 0) update.prix_achat = prixAchat;
    const { error } = await db.from("stock").update(update).eq("id", service.stock_id);
    if (error) return { error: error.message };
    stockId = service.stock_id;
  } else {
    const { data: newStock, error: errStock } = await db.from("stock").insert({
      user_id: userId, nom: service.nom, categorie: "Article",
      quantite, unite: "unité", seuil_alerte: 3, prix_achat: prixAchat ?? 0,
    }).select("id").single();
    if (errStock || !newStock) return { error: errStock?.message ?? "Erreur création stock" };
    const { error: errLink } = await db.from("services").update({ stock_id: newStock.id }).eq("id", serviceId).eq("user_id", userId);
    if (errLink) return { error: errLink.message };
    stockId = newStock.id;
  }

  await db.from("mouvements_stock").insert({
    user_id: userId,
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
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("stock").delete().eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/stock");
  return { success: true };
}
