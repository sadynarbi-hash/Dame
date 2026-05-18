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
import { updateStatutFacture } from "@/lib/actions/factures";
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
  { value: "tous", label: "Toutes" },
  { value: "brouillon", label: "Brouillon" },
  { value: "envoyee", label: "Envoyées" },
  { value: "payee", label: "Payées" },
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

  // Modal montant payé
  const [payModal, setPayModal] = useState<{ id: string; totalTtc: number } | null>(null);
  const [montantSaisi, setMontantSaisi] = useState("");

  // ── Filtrage ──
  const filtered = factures.filter((f) => {
    const q = search.toLowerCase();
    const nomClient = f.client ? `${f.client.prenom} ${f.client.nom}`.toLowerCase() : "";
    if (!f.numero.toLowerCase().includes(q) && !nomClient.includes(q)) return false;
    if (filtreStatut !== "tous" && f.statut !== filtreStatut) return false;

    // Filtre période sur date_emission
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

  const recouvrJour = factures
    .filter(f => f.statut === "payee" && f.date_paiement === today)
    .reduce((s, f) => s + (f.montant_paye ?? f.total_ttc), 0);

  const recouvrMois = factures
    .filter(f => f.statut === "payee" && f.date_paiement && f.date_paiement >= moisDebut)
    .reduce((s, f) => s + (f.montant_paye ?? f.total_ttc), 0);

  const totalFiltre = filtered.reduce((s, f) => s + f.total_ttc, 0);
  const recouvrFiltre = filtered
    .filter(f => f.statut === "payee")
    .reduce((s, f) => s + (f.montant_paye ?? f.total_ttc), 0);

  // ── Marquer payée ──
  const openPayModal = (f: FactureRow) => {
    setMontantSaisi(String(f.total_ttc));
    setPayModal({ id: f.id, totalTtc: f.total_ttc });
  };

  const confirmerPaiement = () => {
    if (!payModal) return;
    const montant = parseInt(montantSaisi) || payModal.totalTtc;
    startTransition(async () => {
      await updateStatutFacture(payModal.id, "payee", undefined, montant);
      setFactures(prev => prev.map(f =>
        f.id === payModal.id
          ? { ...f, statut: "payee" as StatutFacture, montant_paye: montant, date_paiement: todayStr() }
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
              ({value === "tous" ? factures.length : factures.filter(f => f.statut === value).length})
            </span>
          </button>
        ))}
      </div>

      {/* ── Filtres période ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
        {([
          { v: "tout", l: "Tout" },
          { v: "aujourd_hui", l: "Aujourd'hui" },
          { v: "ce_mois", l: "Ce mois" },
          { v: "custom", l: "Période" },
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
          {recouvrFiltre > 0 && (
            <> — Recouvré : <span className="font-semibold text-green-600">{formatFCFA(recouvrFiltre)}</span></>
          )}
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
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Montant payé</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date paiement</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Statut</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/factures/${f.id}`} className="font-mono font-medium text-primary hover:underline">{f.numero}</Link>
                    </td>
                    <td className="px-4 py-3 font-medium">{f.client ? `${f.client.prenom} ${f.client.nom}` : "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(f.date_emission)}</td>
                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">{formatFCFA(f.total_ttc)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {f.statut === "payee"
                        ? <span className="font-bold text-green-600">{formatFCFA(f.montant_paye ?? f.total_ttc)}</span>
                        : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {f.date_paiement ? formatDate(f.date_paiement) : "—"}
                    </td>
                    <td className="px-4 py-3 text-center"><StatutFactureBadge statut={f.statut} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" asChild><Link href={`/factures/${f.id}`}>Voir</Link></Button>
                        {f.statut !== "payee" && (
                          <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50" disabled={isPending}
                            onClick={() => openPayModal(f)}>
                            Marquer payée
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal montant payé ── */}
      <Dialog open={!!payModal} onOpenChange={(open) => { if (!open) setPayModal(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Montant reçu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
              Montant total de la facture : <span className="font-bold">{formatFCFA(payModal?.totalTtc ?? 0)}</span>
            </div>
            <div className="space-y-2">
              <Label>Montant effectivement reçu (FCFA)</Label>
              <Input
                type="number"
                value={montantSaisi}
                onChange={e => setMontantSaisi(e.target.value)}
                placeholder={String(payModal?.totalTtc ?? 0)}
                className="text-lg font-semibold"
              />
              <p className="text-xs text-muted-foreground">Peut être inférieur si paiement partiel.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayModal(null)}>Annuler</Button>
            <Button onClick={confirmerPaiement} disabled={isPending} className="bg-green-600 hover:bg-green-700 text-white">
              {isPending ? "..." : "Confirmer le paiement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
