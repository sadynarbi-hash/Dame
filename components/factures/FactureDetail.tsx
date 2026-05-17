"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Send, CheckCircle, Clock, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StatutFactureBadge } from "@/components/shared/StatutBadge";
import { updateStatutFacture, deleteFacture } from "@/lib/actions/factures";
import { formatFCFA, formatDateLong, TVA_TAUX } from "@/lib/utils/formatters";
import type { StatutFacture } from "@/types";

const MODES_PAIEMENT = [
  { value: "especes", label: "Espèces" },
  { value: "wave", label: "Wave" },
  { value: "orange_money", label: "Orange Money" },
  { value: "cheque", label: "Chèque" },
  { value: "virement", label: "Virement" },
];

const labelModePaiement = (mode: string | null) => {
  if (!mode) return null;
  return MODES_PAIEMENT.find(m => m.value === mode)?.label ?? mode;
};

type Props = {
  facture: {
    id: string; numero: string; statut: StatutFacture;
    date_emission: string; date_echeance: string; date_paiement: string | null;
    sous_total: number; montant_tva: number; total_ttc: number;
    notes: string | null; conditions: string | null;
    mode_paiement: string | null;
    client: { nom: string; prenom: string; telephone: string | null; email: string | null; adresse: string | null } | null;
    lignes: { id: string; designation: string; quantite: number; prix_unitaire_ht: number; tva: number; total_ttc: number }[];
  };
  entreprise: {
    nom: string; adresse: string; telephone: string; email: string;
    site_web: string | null; mentions_legales: string | null;
  } | null;
};

export function FactureDetail({ facture, entreprise }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [paiementOpen, setPaiementOpen] = useState(false);
  const [modePaiement, setModePaiement] = useState("especes");

  const handleStatut = (statut: StatutFacture) => {
    startTransition(async () => { await updateStatutFacture(facture.id, statut); });
  };

  const handlePayer = () => {
    startTransition(async () => {
      await updateStatutFacture(facture.id, "payee", modePaiement);
      setPaiementOpen(false);
    });
  };

  const handleDelete = () => {
    if (confirm("Supprimer cette facture définitivement ?")) {
      startTransition(async () => { await deleteFacture(facture.id); });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" />Retour</Button>
        <div className="flex items-center gap-2 flex-wrap">
          {facture.statut === "brouillon" && (
            <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleStatut("envoyee")}><Send className="h-4 w-4" />Marquer envoyée</Button>
          )}
          {facture.statut !== "payee" && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={isPending} onClick={() => setPaiementOpen(true)}><CheckCircle className="h-4 w-4" />Marquer payée</Button>
          )}
          {facture.statut === "envoyee" && (
            <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleStatut("en_retard")}><Clock className="h-4 w-4" />En retard</Button>
          )}
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" />Imprimer</Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" disabled={isPending} onClick={handleDelete}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>

      <Card className="overflow-hidden print:shadow-none print:border-0">
        <CardContent className="p-8 space-y-8">
          <div className="flex justify-between items-start flex-wrap gap-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">{entreprise?.nom ?? "Salon"}</h2>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{entreprise?.adresse}</p>
              <p className="text-sm text-muted-foreground">{entreprise?.telephone}</p>
              <p className="text-sm text-muted-foreground">{entreprise?.email}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-3 justify-end mb-2">
                <span className="text-3xl font-black">FACTURE</span>
                <StatutFactureBadge statut={facture.statut} />
              </div>
              <p className="font-mono text-lg font-semibold text-muted-foreground">{facture.numero}</p>
              <p className="text-sm text-muted-foreground mt-1">Émis le {formatDateLong(facture.date_emission)}</p>
              <p className="text-sm text-muted-foreground">Échéance : {formatDateLong(facture.date_echeance)}</p>
              {facture.date_paiement && (
                <p className="text-sm text-green-600 font-medium">
                  Payée le {formatDateLong(facture.date_paiement)}
                  {facture.mode_paiement && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                      <CreditCard className="h-3 w-3" />{labelModePaiement(facture.mode_paiement)}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Facturé à</p>
            <p className="font-semibold text-lg">{facture.client ? `${facture.client.prenom} ${facture.client.nom}` : "Client inconnu"}</p>
            {facture.client?.telephone && <p className="text-sm text-muted-foreground">{facture.client.telephone}</p>}
            {facture.client?.email && <p className="text-sm text-muted-foreground">{facture.client.email}</p>}
            {facture.client?.adresse && <p className="text-sm text-muted-foreground">{facture.client.adresse}</p>}
          </div>

          <Separator />

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left font-semibold text-muted-foreground">Désignation</th>
                <th className="pb-3 text-center font-semibold text-muted-foreground">Qté</th>
                <th className="pb-3 text-right font-semibold text-muted-foreground">Prix HT</th>
                <th className="pb-3 text-center font-semibold text-muted-foreground">TVA</th>
                <th className="pb-3 text-right font-semibold text-muted-foreground">Total TTC</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {facture.lignes.map((ligne) => (
                <tr key={ligne.id}>
                  <td className="py-3 font-medium">{ligne.designation}</td>
                  <td className="py-3 text-center text-muted-foreground">{ligne.quantite}</td>
                  <td className="py-3 text-right text-muted-foreground">{formatFCFA(ligne.prix_unitaire_ht)}</td>
                  <td className="py-3 text-center text-muted-foreground">{ligne.tva}%</td>
                  <td className="py-3 text-right font-semibold">{formatFCFA(ligne.total_ttc)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-72 space-y-2 rounded-xl bg-muted/40 p-4">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sous-total HT</span><span>{formatFCFA(facture.sous_total)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">TVA ({TVA_TAUX}%)</span><span>{formatFCFA(facture.montant_tva)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-xl"><span>Total TTC</span><span className="text-primary">{formatFCFA(facture.total_ttc)}</span></div>
            </div>
          </div>

          {(facture.notes || facture.conditions) && (
            <>
              <Separator />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                {facture.notes && <div><p className="font-semibold text-muted-foreground mb-1">Notes</p><p className="text-muted-foreground">{facture.notes}</p></div>}
                {facture.conditions && <div><p className="font-semibold text-muted-foreground mb-1">Conditions</p><p className="text-muted-foreground">{facture.conditions}</p></div>}
              </div>
            </>
          )}

          {entreprise?.mentions_legales && (
            <p className="text-xs text-muted-foreground/60 text-center border-t pt-4">{entreprise.mentions_legales}</p>
          )}
        </CardContent>
      </Card>

      {/* Dialog mode de paiement */}
      <Dialog open={paiementOpen} onOpenChange={setPaiementOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle>Mode de paiement</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Label>Comment le client a-t-il payé ?</Label>
            <Select value={modePaiement} onValueChange={setModePaiement}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODES_PAIEMENT.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaiementOpen(false)}>Annuler</Button>
            <Button className="bg-green-600 hover:bg-green-700" disabled={isPending} onClick={handlePayer}>
              <CheckCircle className="h-4 w-4" />Confirmer paiement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
