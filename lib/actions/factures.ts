"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { StatutFacture } from "@/types";

export async function createFacture(data: {
  clientId: string; dateEmission: string; dateEcheance: string;
  lignes: { serviceId?: string; agentId?: string; designation: string; quantite: number; prixUnitaireHT: number; tva: number; totalHT: number; totalTTC: number; }[];
  sousTotal: number; montantTva: number; totalTTC: number;
  notes?: string; conditions?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  // Générer le numéro de facture
  const { count } = await supabase.from("factures").select("*", { count: "exact", head: true }).eq("user_id", user.id);
  const annee = new Date().getFullYear();
  const numero = `FAC-${annee}-${String((count ?? 0) + 1).padStart(4, "0")}`;

  const { data: facture, error: factureError } = await supabase
    .from("factures")
    .insert({
      user_id: user.id,
      client_id: data.clientId,
      numero,
      statut: "brouillon",
      date_emission: data.dateEmission,
      date_echeance: data.dateEcheance,
      sous_total: data.sousTotal,
      montant_tva: data.montantTva,
      total_ttc: data.totalTTC,
      notes: data.notes,
      conditions: data.conditions,
    })
    .select()
    .single();

  if (factureError) return { error: factureError.message };

  // Insérer les lignes
  const lignes = data.lignes.map((l, i) => ({
    facture_id: facture.id,
    service_id: l.serviceId ?? null,
    agent_id: l.agentId ?? null,
    designation: l.designation,
    quantite: l.quantite,
    prix_unitaire_ht: l.prixUnitaireHT,
    tva: l.tva,
    total_ht: l.totalHT,
    total_ttc: l.totalTTC,
    ordre: i,
  }));

  const { error: lignesError } = await supabase.from("lignes_facture").insert(lignes);
  if (lignesError) return { error: lignesError.message };

  // Mettre à jour total_depense, nb_factures et derniere_visite
  const { data: clientRow } = await supabase.from("clients").select("total_depense, nb_factures").eq("id", data.clientId).single();
  if (clientRow) {
    await supabase.from("clients").update({
      total_depense: clientRow.total_depense + data.totalTTC,
      nb_factures: clientRow.nb_factures + 1,
      derniere_visite: data.dateEmission,
    }).eq("id", data.clientId);
  }

  // Décrémenter le stock + enregistrer mouvements de sortie
  const serviceIds = data.lignes.map(l => l.serviceId).filter(Boolean) as string[];
  if (serviceIds.length > 0) {
    const { data: svcs } = await supabase.from("services").select("id, type, stock_id, nom").in("id", serviceIds);
    const articleSvcs = (svcs ?? []).filter(s => s.type === "article" && s.stock_id);
    for (const svc of articleSvcs) {
      const ligne = data.lignes.find(l => l.serviceId === svc.id);
      if (!ligne || !svc.stock_id) continue;
      const { data: stockItem } = await supabase.from("stock").select("quantite").eq("id", svc.stock_id).single();
      if (stockItem) {
        await supabase.from("stock").update({ quantite: Math.max(0, stockItem.quantite - ligne.quantite) }).eq("id", svc.stock_id);
        await supabase.from("mouvements_stock").insert({
          user_id: user.id,
          stock_id: svc.stock_id,
          article_nom: svc.nom,
          type: "sortie",
          quantite: ligne.quantite,
          prix_unitaire: ligne.prixUnitaireHT,
          facture_id: facture.id,
        });
      }
    }
    revalidatePath("/stock");
  }

  revalidatePath("/factures");
  redirect(`/factures/${facture.id}`);
}

export async function updateStatutFacture(id: string, statut: StatutFacture, modePaiement?: string) {
  const supabase = createClient();
  const update: Record<string, unknown> = { statut };
  if (statut === "payee") {
    update.date_paiement = new Date().toISOString().split("T")[0];
    if (modePaiement) update.mode_paiement = modePaiement;
  }

  const { error } = await supabase.from("factures").update(update).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/factures");
  revalidatePath(`/factures/${id}`);
  return { success: true };
}

export async function deleteFacture(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("factures").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/factures");
  redirect("/factures");
}
