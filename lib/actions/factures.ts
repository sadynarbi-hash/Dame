"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDataContext } from "@/lib/auth/context";
import { getEffectivePlan, PLAN_LIMITS } from "@/lib/plan";
import type { StatutFacture } from "@/types";

export async function createFacture(data: {
  clientId: string; dateEmission: string; dateEcheance: string;
  modePaiement?: string;
  lignes: { serviceId?: string; agentId?: string; designation: string; quantite: number; prixUnitaireHT: number; tva: number; totalHT: number; totalTTC: number; }[];
  sousTotal: number; montantTva: number; totalTTC: number;
  notes?: string; conditions?: string;
}) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  // Vérification limite plan Starter (100 factures/mois)
  const { data: entreprise } = await db
    .from("entreprises")
    .select("abonnement_statut, abonnement_plan, trial_ends_at")
    .eq("user_id", userId)
    .single();
  const plan = getEffectivePlan(
    entreprise?.abonnement_statut ?? null,
    entreprise?.abonnement_plan ?? null,
    entreprise?.trial_ends_at ?? null
  );
  if (plan === "gratuit" || plan === "starter") {
    const limite = PLAN_LIMITS[plan].factures_mois;
    const debut = new Date(); debut.setDate(1); debut.setHours(0, 0, 0, 0);
    const { count: countMois } = await db
      .from("factures")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("date_emission", debut.toISOString().slice(0, 10));
    if ((countMois ?? 0) >= limite) {
      const upgrade = plan === "gratuit"
        ? "Passez au plan Starter (4 500 FCFA/mois) ou Business pour plus de factures."
        : "Passez au plan Business pour des factures illimitées.";
      return { error: `Limite atteinte : le plan ${plan === "gratuit" ? "Gratuit" : "Starter"} est limité à ${limite} factures par mois. ${upgrade}` };
    }
  }

  const { count } = await db.from("factures").select("*", { count: "exact", head: true }).eq("user_id", userId);
  const annee = new Date().getFullYear();
  const numero = `FAC-${annee}-${String((count ?? 0) + 1).padStart(4, "0")}`;

  const { data: facture, error: factureError } = await db
    .from("factures")
    .insert({
      user_id: userId,
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
      mode_paiement: data.modePaiement ?? null,
    })
    .select()
    .single();

  if (factureError) return { error: factureError.message };

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

  const { error: lignesError } = await db.from("lignes_facture").insert(lignes);
  if (lignesError) return { error: lignesError.message };

  const { data: clientRow } = await db.from("clients").select("total_depense, nb_factures").eq("id", data.clientId).eq("user_id", userId).single();
  if (clientRow) {
    await db.from("clients").update({
      total_depense: clientRow.total_depense + data.totalTTC,
      nb_factures: clientRow.nb_factures + 1,
      derniere_visite: data.dateEmission,
    }).eq("id", data.clientId).eq("user_id", userId);
  }

  const serviceIds = data.lignes.map(l => l.serviceId).filter(Boolean) as string[];
  if (serviceIds.length > 0) {
    const { data: svcs } = await db.from("services").select("id, type, stock_id, nom").eq("user_id", userId).in("id", serviceIds);
    const articleSvcs = (svcs ?? []).filter((s: { type: string; stock_id: string | null }) => s.type === "article" && s.stock_id);
    for (const svc of articleSvcs as { id: string; nom: string; stock_id: string }[]) {
      const ligne = data.lignes.find(l => l.serviceId === svc.id);
      if (!ligne) continue;
      const { data: stockItem } = await db.from("stock").select("quantite").eq("id", svc.stock_id).single();
      if (stockItem) {
        await db.from("stock").update({ quantite: Math.max(0, stockItem.quantite - ligne.quantite) }).eq("id", svc.stock_id);
        await db.from("mouvements_stock").insert({
          user_id: userId,
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

export async function updateStatutFacture(id: string, statut: StatutFacture, modePaiement?: string, montantPaye?: number) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const update: Record<string, unknown> = { statut };
  if (statut === "payee") {
    update.date_paiement = new Date().toISOString().split("T")[0];
    if (modePaiement) update.mode_paiement = modePaiement;
    if (montantPaye !== undefined) update.montant_paye = montantPaye;
  }

  const { error } = await db.from("factures").update(update).eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/factures");
  revalidatePath(`/factures/${id}`);
  return { success: true };
}

export async function deleteFacture(id: string) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("factures").delete().eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/factures");
  redirect("/factures");
}
