import type { DataContext } from "@/lib/auth/context";
import { createClient } from "@/lib/supabase/server";

// biome-ignore lint/suspicious/noExplicitAny: untyped service role client
type AnyClient = any;

export async function getStatsDashboard(ctx?: DataContext) {
  const db: AnyClient = ctx?.db ?? createClient();
  const uid = ctx?.userId;

  const byUser = uid ? { eq: (q: AnyClient) => q.eq("user_id", uid) } : { eq: (q: AnyClient) => q };

  const [
    { data: factures },
    { data: clients },
    { data: rdv },
    { data: charges },
    { data: stock },
    { data: lignes },
    { data: topClientsData },
  ] = await Promise.all([
    byUser.eq(db.from("factures").select("statut, total_ttc, date_paiement")),
    byUser.eq(db.from("clients").select("id")),
    byUser.eq(db.from("rendez_vous").select("date, statut")),
    byUser.eq(db.from("charges").select("montant, mois, annee")),
    byUser.eq(db.from("stock").select("quantite, seuil_alerte")),
    // lignes_facture: filter via join on factures
    uid
      ? db.from("lignes_facture").select("designation, quantite, total_ttc, factures!inner(user_id)").eq("factures.user_id", uid)
      : db.from("lignes_facture").select("designation, quantite, total_ttc"),
    byUser.eq(
      db.from("clients").select("id, prenom, nom, total_depense, nb_factures").order("total_depense", { ascending: false }).limit(5)
    ),
  ]);

  const f: { statut: string; total_ttc: number; date_paiement: string | null }[] = factures ?? [];
  const ch: { montant: number; mois: number; annee: number }[] = charges ?? [];

  const payees = f.filter((x) => x.statut === "payee");
  const enAttente = f.filter((x) => x.statut === "envoyee");
  const enRetard = f.filter((x) => x.statut === "en_retard");
  const emises = f.filter((x) => x.statut !== "brouillon");

  const aujourd_hui = new Date();
  const debutSemaine = new Date(aujourd_hui);
  debutSemaine.setDate(aujourd_hui.getDate() - aujourd_hui.getDay());
  const finSemaine = new Date(debutSemaine);
  finSemaine.setDate(debutSemaine.getDate() + 6);
  const nbRdvSemaine = ((rdv ?? []) as { date: string }[]).filter((r) => {
    const d = new Date(r.date);
    return d >= debutSemaine && d <= finSemaine;
  }).length;

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

  const servicesMap = new Map<string, { totalVendu: number; totalCA: number }>();
  for (const l of (lignes ?? []) as { designation: string; quantite: number; total_ttc: number }[]) {
    const existing = servicesMap.get(l.designation) ?? { totalVendu: 0, totalCA: 0 };
    servicesMap.set(l.designation, { totalVendu: existing.totalVendu + l.quantite, totalCA: existing.totalCA + l.total_ttc });
  }
  const topServices = Array.from(servicesMap.entries())
    .map(([designation, v]) => ({ designation, ...v }))
    .sort((a, b) => b.totalCA - a.totalCA)
    .slice(0, 5);

  return {
    totalFactures: f.length,
    montantTotal: f.reduce((s, x) => s + x.total_ttc, 0),
    caGlobal: emises.reduce((s, x) => s + x.total_ttc, 0),
    caEncaisse: payees.reduce((s, x) => s + x.total_ttc, 0),
    caNonRecouvre: [...enAttente, ...enRetard].reduce((s, x) => s + x.total_ttc, 0),
    montantPaye: payees.reduce((s, x) => s + x.total_ttc, 0),
    montantEnAttente: enAttente.reduce((s, x) => s + x.total_ttc, 0),
    montantEnRetard: enRetard.reduce((s, x) => s + x.total_ttc, 0),
    nbClients: (clients ?? []).length,
    nbRendezVousSemaine: nbRdvSemaine,
    alertesStock: ((stock ?? []) as { quantite: number; seuil_alerte: number }[]).filter((a) => a.quantite <= a.seuil_alerte).length,
    evolutionMensuelle,
    topServices,
    topClients: (topClientsData ?? []) as { id: string; prenom: string; nom: string; total_depense: number; nb_factures: number }[],
  };
}
