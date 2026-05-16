import { createClient } from "@/lib/supabase/server";

export async function getStatsDashboard() {
  const supabase = createClient();

  const [
    { data: factures },
    { data: clients },
    { data: rdv },
    { data: charges },
    { data: stock },
  ] = await Promise.all([
    supabase.from("factures").select("statut, total_ttc, date_paiement"),
    supabase.from("clients").select("id"),
    supabase.from("rendez_vous").select("date, statut"),
    supabase.from("charges").select("montant, mois, annee"),
    supabase.from("stock").select("quantite, seuil_alerte"),
  ]);

  const f = factures ?? [];
  const ch = charges ?? [];

  const payees = f.filter((x) => x.statut === "payee");
  const enAttente = f.filter((x) => x.statut === "envoyee");
  const enRetard = f.filter((x) => x.statut === "en_retard");

  // Rendez-vous cette semaine
  const aujourd_hui = new Date();
  const debutSemaine = new Date(aujourd_hui);
  debutSemaine.setDate(aujourd_hui.getDate() - aujourd_hui.getDay());
  const finSemaine = new Date(debutSemaine);
  finSemaine.setDate(debutSemaine.getDate() + 6);
  const nbRdvSemaine = (rdv ?? []).filter((r) => {
    const d = new Date(r.date);
    return d >= debutSemaine && d <= finSemaine;
  }).length;

  // Évolution 6 mois
  const moisLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const evolutionMensuelle = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth() + 1;
    const a = d.getFullYear();
    const revenus = payees
      .filter((x) => x.date_paiement?.startsWith(`${a}-${String(m).padStart(2, "0")}`))
      .reduce((s, x) => s + x.total_ttc, 0);
    const chargesMois = ch
      .filter((c) => c.mois === m && c.annee === a)
      .reduce((s, c) => s + c.montant, 0);
    return { mois: moisLabels[m - 1], revenus, charges: chargesMois };
  });

  return {
    totalFactures: f.length,
    montantTotal: f.reduce((s, x) => s + x.total_ttc, 0),
    montantPaye: payees.reduce((s, x) => s + x.total_ttc, 0),
    montantEnAttente: enAttente.reduce((s, x) => s + x.total_ttc, 0),
    montantEnRetard: enRetard.reduce((s, x) => s + x.total_ttc, 0),
    nbClients: (clients ?? []).length,
    nbRendezVousSemaine: nbRdvSemaine,
    alertesStock: (stock ?? []).filter((a) => a.quantite <= a.seuil_alerte).length,
    evolutionMensuelle,
  };
}
