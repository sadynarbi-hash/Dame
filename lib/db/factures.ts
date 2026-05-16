import { createClient } from "@/lib/supabase/server";

export async function getFactures() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("factures")
    .select("*, client:clients(id, nom, prenom, telephone, email, adresse), lignes:lignes_facture(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getFactureById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("factures")
    .select("*, client:clients(*), lignes:lignes_facture(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getStatsFactures() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("factures")
    .select("statut, total_ttc, date_paiement");
  if (error) throw error;

  const payees = data.filter((f) => f.statut === "payee");
  const enAttente = data.filter((f) => f.statut === "envoyee");
  const enRetard = data.filter((f) => f.statut === "en_retard");

  return {
    totalFactures: data.length,
    montantTotal: data.reduce((s, f) => s + f.total_ttc, 0),
    montantPaye: payees.reduce((s, f) => s + f.total_ttc, 0),
    montantEnAttente: enAttente.reduce((s, f) => s + f.total_ttc, 0),
    montantEnRetard: enRetard.reduce((s, f) => s + f.total_ttc, 0),
  };
}
