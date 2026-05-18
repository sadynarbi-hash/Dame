"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, FileText, TrendingUp, Calendar, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { StatutFactureBadge } from "@/components/shared/StatutBadge";
import { ajouterPaiement } from "@/lib/actions/factures";
import { formatFCFA, formatDate } from "@/lib/utils/formatters";
import type { StatutFacture } from "@/types";

type FactureRow = {
  id: string; numero: string; statut: StatutFacture;
  date_emission: string; date_echeance: string;
  date_paiement: string | null;
  total_ttc: number; montant_paye: number | null;
  client: { id: string; nom: string; prenom: string } | null;
};

const STATUTS: { value: StatutFacture | "tous"; label: string }[] = [
  { value: "tous",      label: "Toutes" },
  { value: "brouillon", label: "Brouillon" },
  { value: "envoyee",   label: "Envoyées" },
  { value: "partielle", label: "Paiement partiel" },
  { value: "payee",     label: "Payées" },
  { value: "en_retard", label: "En retard" },
];

type PeriodFilter = "tout" | "aujourd_hui" | "ce_mois" | "custom";

function todayStr() { return new Date().toISOString().slice(0, 10); }
function monthStart() { const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10); }

export function FacturesClient({ initialFactures }: { initialFactures: FactureRow[] }) {
  const [factures, setFactures] = useState(initialFactures);
  const [search, setSearch] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<StatutFacture | "tous">("tous");
  const [period, setPeriod] = useState<PeriodFilter>("tout");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modal paiement
  const [payModal, setPayModal] = useState<FactureRow | null>(null);
  const [montantSaisi, setMontantSaisi] = useState("");

  // ── Filtrage ──
  const filtered = factures.filter((f) => {
    const q = search.toLowerCase();
    const nomClient = f.client ? `${f.client.prenom} ${f.client.nom}`.toLowerCase() : "";
    if (!f.numero.toLowerCase().includes(q) && !nomClient.includes(q)) return false;
    if (filtreStatut !== "tous") {
      const paye = f.montant_paye ?? 0;
      const statutReel: StatutFacture = (f.statut !== "payee" && paye > 0) ? "partielle" : f.statut;
      if (statutReel !== filtreStatut) return false;
    }
    const dateRef = f.date_emission;
    if (period === "aujourd_hui" && dateRef !== todayStr()) return false;
    if (period === "ce_mois" && dateRef < monthStart()) return false;
    if (period === "custom") {
      if (customFrom && dateRef < customFrom) return false;
      if (customTo && dateRef > customTo) return false;
    }
    return true;
  });

  // ── Stats recouvrement ──
  const today = todayStr();
  const moisDebut = monthStart();
  // Pour les factures payées sans montant_paye (données avant migration), on utilise total_ttc
  const amountRecouvr = (f: FactureRow) =>
    f.statut === "payee" ? (f.montant_paye || f.total_ttc) : (f.montant_paye ?? 0);
  const recouvrJour = factures
    .filter(f => f.date_emission === today)
    .reduce((s, f) => s + amountRecouvr(f), 0);
  const recouvrMois = factures
    .filter(f => f.date_emission >= moisDebut)
    .reduce((s, f) => s + amountRecouvr(f), 0);

  const totalFiltre = filtered.reduce((s, f) => s + f.total_ttc, 0);
  const recouvrFiltre = filtered.reduce((s, f) => s + (f.montant_paye ?? 0), 0);

  // ── Ouvrir modal paiement ──
  const openPayModal = (f: FactureRow) => {
    const restant = f.total_ttc - (f.montant_paye ?? 0);
    setMontantSaisi(String(restant));
    setPayModal(f);
  };

  const confirmerPaiement = () => {
    if (!payModal) return;
    const montant = parseInt(montantSaisi) || 0;
    if (montant <= 0) return;
    startTransition(async () => {
      const res = await ajouterPaiement(payModal.id, montant);
      if (res?.error) { alert(res.error); return; }
      setFactures(prev => prev.map(f =>
        f.id === payModal.id
          ? {
              ...f,
              montant_paye: res.nouveauTotal ?? (f.montant_paye ?? 0) + montant,
              statut: res.solde ? "payee" as StatutFacture : f.statut,
              date_paiement: res.solde ? todayStr() : f.date_paiement,
            }
          : f
      ));
      setPayModal(null);
    });
  };

  return (
    <div className="space-y-5">

      {/* ── Stats recouvrement ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Recouvré aujourd&apos;hui</p>
            <p className="text-lg font-bold text-green-600">{formatFCFA(recouvrJour)}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Recouvré ce mois</p>
            <p className="text-lg font-bold text-blue-600">{formatFCFA(recouvrMois)}</p>
          </div>
        </div>
      </div>

      {/* ── Barre de recherche + bouton ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button asChild><Link href="/factures/nouvelle"><Plus className="h-4 w-4" />Nouvelle facture</Link></Button>
      </div>

      {/* ── Filtres statut ── */}
      <div className="flex gap-2 flex-wrap">
        {STATUTS.map(({ value, label }) => (
          <button key={value} onClick={() => setFiltreStatut(value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filtreStatut === value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
            {label}
            <span className="ml-1.5 text-xs opacity-70">
              ({value === "tous" ? factures.length : factures.filter(f => {
              const p = f.montant_paye ?? 0;
              const s: StatutFacture = (f.statut !== "payee" && p > 0) ? "partielle" : f.statut;
              return s === value;
            }).length})
            </span>
          </button>
        ))}
      </div>

      {/* ── Filtres période ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
        {([
          { v: "tout",        l: "Tout" },
          { v: "aujourd_hui", l: "Aujourd'hui" },
          { v: "ce_mois",     l: "Ce mois" },
          { v: "custom",      l: "Période" },
        ] as { v: PeriodFilter; l: string }[]).map(({ v, l }) => (
          <button key={v} onClick={() => setPeriod(v)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${period === v ? "bg-stone-800 text-white border-stone-800" : "bg-white border-stone-200 hover:bg-stone-50"}`}>
            {l}
          </button>
        ))}
        {period === "custom" && (
          <div className="flex items-center gap-2">
            <Input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="h-8 text-xs w-36" />
            <span className="text-xs text-muted-foreground">→</span>
            <Input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="h-8 text-xs w-36" />
          </div>
        )}
      </div>

      {/* ── Résumé ── */}
      {filtered.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} facture(s) — Facturé : <span className="font-semibold text-foreground">{formatFCFA(totalFiltre)}</span>
          {recouvrFiltre > 0 && <> — Recouvré : <span className="font-semibold text-green-600">{formatFCFA(recouvrFiltre)}</span></>}
        </p>
      )}

      {/* ── Tableau ── */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">Aucune facture trouvée</p>
            <Button className="mt-4" asChild><Link href="/factures/nouvelle">Créer une facture</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Numéro</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Client</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Montant TTC</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Payé</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Restant</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date paiement</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Statut</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((f) => {
                  const paye = f.montant_paye ?? 0;
                  const restant = f.total_ttc - paye;
                  const estSolde = f.statut === "payee";
                  // "partielle" est dérivé visuellement — jamais écrit en base
                  const statutAffiche: StatutFacture = (!estSolde && paye > 0) ? "partielle" : f.statut;
                  const rowClass = estSolde
                    ? "bg-green-50 hover:bg-green-100 transition-colors"
                    : paye > 0
                    ? "bg-yellow-50 hover:bg-yellow-100 transition-colors"
                    : "hover:bg-muted/30 transition-colors";
                  return (
                    <tr key={f.id} className={rowClass}>
                      <td className="px-4 py-3">
                        <Link href={`/factures/${f.id}`} className="font-mono font-medium text-primary hover:underline">{f.numero}</Link>
                      </td>
                      <td className="px-4 py-3 font-medium">{f.client ? `${f.client.prenom} ${f.client.nom}` : "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(f.date_emission)}</td>
                      <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">{formatFCFA(f.total_ttc)}</td>
                      {/* Payé */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {paye > 0
                          ? <span className={`font-bold ${estSolde ? "text-green-600" : "text-amber-600"}`}>{formatFCFA(paye)}</span>
                          : <span className="text-muted-foreground">—</span>}
                      </td>
                      {/* Restant */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {estSolde
                          ? <span className="text-green-600 font-medium text-xs">✓ Soldé</span>
                          : restant > 0
                            ? <span className="font-bold text-red-500">{formatFCFA(restant)}</span>
                            : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {f.date_paiement ? formatDate(f.date_paiement) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center"><StatutFactureBadge statut={statutAffiche} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" asChild><Link href={`/factures/${f.id}`}>Voir</Link></Button>
                          {!estSolde && (
                            <Button variant="ghost" size="sm"
                              className={paye > 0 ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"}
                              disabled={isPending}
                              onClick={() => openPayModal(f)}>
                              {paye > 0 ? "Compléter" : "Payer"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal paiement ── */}
      <Dialog open={!!payModal} onOpenChange={(open) => { if (!open) setPayModal(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {(payModal?.montant_paye ?? 0) > 0 ? "Compléter le paiement" : "Enregistrer un paiement"}
            </DialogTitle>
          </DialogHeader>
          {payModal && (
            <div className="space-y-4 py-1">
              {/* Récapitulatif */}
              <div className="rounded-xl bg-muted/40 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total facture</span>
                  <span className="font-semibold">{formatFCFA(payModal.total_ttc)}</span>
                </div>
                {(payModal.montant_paye ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Déjà versé</span>
                    <span className="font-semibold text-amber-600">{formatFCFA(payModal.montant_paye ?? 0)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Restant dû</span>
                  <span className="text-red-500">{formatFCFA(payModal.total_ttc - (payModal.montant_paye ?? 0))}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Montant versé maintenant (FCFA)</Label>
                <Input
                  type="number"
                  value={montantSaisi}
                  onChange={e => setMontantSaisi(e.target.value)}
                  className="text-lg font-semibold"
                  autoFocus
                />
                {parseInt(montantSaisi) > 0 && parseInt(montantSaisi) < (payModal.total_ttc - (payModal.montant_paye ?? 0)) && (
                  <p className="text-xs text-amber-600">
                    Paiement partiel — il restera <strong>{formatFCFA(payModal.total_ttc - (payModal.montant_paye ?? 0) - parseInt(montantSaisi))}</strong> à régler.
                  </p>
                )}
                {parseInt(montantSaisi) >= (payModal.total_ttc - (payModal.montant_paye ?? 0)) && (
                  <p className="text-xs text-green-600">✓ La facture sera soldée.</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayModal(null)}>Annuler</Button>
            <Button onClick={confirmerPaiement} disabled={isPending || !parseInt(montantSaisi)}
              className="bg-green-600 hover:bg-green-700 text-white">
              {isPending ? "..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
