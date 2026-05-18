"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle, Clock, Trash2, CreditCard, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StatutFactureBadge } from "@/components/shared/StatutBadge";
import { FacturePdfButton } from "@/components/factures/FacturePdfButton";
import { updateStatutFacture, deleteFacture, ajouterPaiement } from "@/lib/actions/factures";
import { formatFCFA, formatDate } from "@/lib/utils/formatters";
import type { StatutFacture } from "@/types";

const MODES_PAIEMENT = [
  { value: "especes", label: "Espèces" },
  { value: "wave", label: "Wave" },
  { value: "orange_money", label: "Orange Money" },
  { value: "cheque", label: "Chèque" },
  { value: "virement", label: "Virement" },
];

const labelModePaiement = (mode: string | null) =>
  mode ? (MODES_PAIEMENT.find(m => m.value === mode)?.label ?? mode) : null;

type Ligne = {
  id: string; designation: string; quantite: number;
  prix_unitaire_ht: number; tva: number; total_ttc: number;
  agent: { nom: string } | null;
};

type Props = {
  facture: {
    id: string; numero: string; statut: StatutFacture;
    date_emission: string; date_echeance: string; date_paiement: string | null;
    sous_total: number; montant_tva: number; total_ttc: number; montant_paye: number | null;
    notes: string | null; conditions: string | null;
    mode_paiement: string | null;
    client: { nom: string; prenom: string; telephone: string | null; email: string | null; adresse: string | null } | null;
    lignes: Ligne[];
  };
  entreprise: {
    nom: string; adresse: string; telephone: string; email: string;
    logo: string | null; couleur_principale: string | null;
    site_web: string | null; mentions_legales: string | null;
  } | null;
};

export function FactureDetail({ facture, entreprise }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [paiementOpen, setPaiementOpen] = useState(false);
  const [modePaiement, setModePaiement] = useState("especes");
  const [montantSaisi, setMontantSaisi] = useState("");
  const [localPaye, setLocalPaye] = useState(facture.montant_paye ?? 0);
  const [localStatut, setLocalStatut] = useState<StatutFacture>(facture.statut);

  const couleur = entreprise?.couleur_principale ?? "#7c3aed";
  const estSolde = localStatut === "payee";
  const restant = facture.total_ttc - localPaye;
  const statutAffiche: StatutFacture = (!estSolde && localPaye > 0) ? "partielle" : localStatut;

  const handleStatut = (statut: StatutFacture) => {
    startTransition(async () => { await updateStatutFacture(facture.id, statut); });
  };

  const openPaiementModal = () => {
    setMontantSaisi(String(restant));
    setPaiementOpen(true);
  };

  const handlePayer = () => {
    const montant = parseInt(montantSaisi);
    if (!montant || montant <= 0) return;
    startTransition(async () => {
      const res = await ajouterPaiement(facture.id, montant);
      if (res?.success) {
        const nouveauPaye = res.nouveauTotal as number;
        setLocalPaye(nouveauPaye);
        setLocalStatut(res.solde ? "payee" : "envoyee");
        setPaiementOpen(false);
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Supprimer cette facture définitivement ?")) {
      startTransition(async () => { await deleteFacture(facture.id); });
    }
  };

  // Agent(s) de la facture
  const agents = Array.from(new Set(facture.lignes.map(l => l.agent?.nom).filter((n): n is string => Boolean(n))));
  const staffLabel = agents.length > 0 ? agents.join(", ") : null;

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Barre d'actions */}
      <div className="flex items-center justify-between flex-wrap gap-2 print:hidden">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" />Retour</Button>
        <div className="flex items-center gap-2 flex-wrap">
          <StatutFactureBadge statut={statutAffiche} />
          {localStatut === "brouillon" && (
            <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleStatut("envoyee")}><Send className="h-4 w-4" />Envoyer</Button>
          )}
          {!estSolde && (
            <Button size="sm"
              className={localPaye > 0 ? "bg-amber-500 hover:bg-amber-600" : "bg-green-600 hover:bg-green-700"}
              disabled={isPending} onClick={openPaiementModal}>
              <CheckCircle className="h-4 w-4" />{localPaye > 0 ? "Compléter" : "Payée"}
            </Button>
          )}
          {localStatut === "envoyee" && (
            <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleStatut("en_retard")}><Clock className="h-4 w-4" /></Button>
          )}
          <Button variant="ghost" size="sm" className="text-destructive" disabled={isPending} onClick={handleDelete}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Reçu */}
      <div id="facture-content" className="bg-white rounded-2xl shadow-md overflow-hidden border">
        {/* Bandeau FACTURE */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Facture</span>
          <span className="font-mono text-sm font-semibold text-gray-500">{facture.numero}</span>
        </div>

        {/* En-tête salon — fond neutre */}
        <div className="flex flex-col items-center pt-6 pb-5 px-6 gap-2 bg-white">
          {entreprise?.logo ? (
            <img src={entreprise.logo} alt={entreprise.nom} className="h-20 w-20 rounded-full object-cover border-4 border-gray-100 shadow" />
          ) : (
            <div className="h-20 w-20 rounded-full flex items-center justify-center border-4 border-gray-100 shadow text-2xl font-bold text-white" style={{ backgroundColor: couleur }}>
              {entreprise?.nom?.[0] ?? "S"}
            </div>
          )}
          <h2 className="text-lg font-bold mt-1">{entreprise?.nom ?? "Salon"}</h2>
          <div className="flex flex-col items-center gap-0.5 text-sm text-muted-foreground">
            {entreprise?.telephone && (
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{entreprise.telephone}</span>
            )}
            {entreprise?.email && (
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{entreprise.email}</span>
            )}
            {entreprise?.adresse && (
              <span className="flex items-center gap-1 text-center"><MapPin className="h-3 w-3 shrink-0" />{entreprise.adresse}</span>
            )}
          </div>
        </div>

        <Separator />

        {/* Numéro / Date / Staff */}
        <div className="grid grid-cols-3 text-center px-4 py-3 text-xs bg-muted/30">
          <div>
            <p className="text-muted-foreground uppercase tracking-wide">Reçu</p>
            <p className="font-bold font-mono">{facture.numero.split("-").pop()}</p>
          </div>
          <div>
            <p className="text-muted-foreground uppercase tracking-wide">Date</p>
            <p className="font-semibold">{formatDate(facture.date_emission)}</p>
          </div>
          {staffLabel ? (
            <div>
              <p className="text-muted-foreground uppercase tracking-wide">Staff</p>
              <p className="font-semibold truncate">{staffLabel}</p>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground uppercase tracking-wide">Client</p>
              <p className="font-semibold truncate">{facture.client?.prenom ?? "—"}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Lignes */}
        <div className="px-6 py-4 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-2">
            <span>Articles</span><span>Prix</span>
          </div>
          {facture.lignes.map((l) => (
            <div key={l.id} className="flex justify-between items-baseline gap-2 py-1">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight">{l.designation}</p>
                {l.quantite > 1 && (
                  <p className="text-xs text-muted-foreground">{l.quantite} × {formatFCFA(l.prix_unitaire_ht)}</p>
                )}
              </div>
              <span className="font-semibold text-sm shrink-0">{formatFCFA(l.total_ttc)}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totaux */}
        <div className="px-6 py-4 space-y-2">
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span style={{ color: couleur }}>{formatFCFA(facture.total_ttc)}</span>
          </div>
          {localPaye > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Déjà versé</span>
              <span className="font-semibold text-green-600">{formatFCFA(localPaye)}</span>
            </div>
          )}
          {!estSolde && localPaye > 0 && (
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-muted-foreground">Restant dû</span>
              <span className="text-red-500">{formatFCFA(restant)}</span>
            </div>
          )}
          {facture.mode_paiement && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mode de paiement</span>
              <span className="font-semibold flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                {labelModePaiement(facture.mode_paiement)}
              </span>
            </div>
          )}
          {facture.date_paiement && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payée le</span>
              <span className="font-semibold text-green-600">{formatDate(facture.date_paiement)}</span>
            </div>
          )}
        </div>

        {/* Notes / Conditions */}
        {(facture.notes || facture.conditions) && (
          <>
            <Separator />
            <div className="px-6 py-3 text-xs text-muted-foreground text-center space-y-1">
              {facture.notes && <p>{facture.notes}</p>}
              {facture.conditions && <p className="italic">{facture.conditions}</p>}
            </div>
          </>
        )}

        {entreprise?.mentions_legales && (
          <div className="px-6 pb-4 text-[10px] text-muted-foreground/50 text-center">
            {entreprise.mentions_legales}
          </div>
        )}
      </div>

      {/* Bouton Envoyer */}
      <div className="print:hidden">
        <FacturePdfButton facture={facture} couleur={couleur} />
      </div>

      {/* Dialog paiement */}
      <Dialog open={paiementOpen} onOpenChange={setPaiementOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>{localPaye > 0 ? "Compléter le paiement" : "Enregistrer un paiement"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total facture</span>
                <span className="font-semibold">{formatFCFA(facture.total_ttc)}</span>
              </div>
              {localPaye > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Déjà versé</span>
                  <span className="font-semibold text-amber-600">{formatFCFA(localPaye)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span className="text-muted-foreground">Restant dû</span>
                <span className="text-red-500">{formatFCFA(restant)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Montant versé (FCFA)</Label>
              <Input
                type="number" min={1} max={restant}
                value={montantSaisi}
                onChange={(e) => setMontantSaisi(e.target.value)}
                placeholder={String(restant)}
              />
            </div>
            {parseInt(montantSaisi) > 0 && parseInt(montantSaisi) < restant && (
              <p className="text-xs text-amber-600">Paiement partiel — il restera <strong>{formatFCFA(restant - parseInt(montantSaisi))}</strong> à régler.</p>
            )}
            {parseInt(montantSaisi) >= restant && (
              <p className="text-xs text-green-600 font-medium">La facture sera entièrement soldée.</p>
            )}
            <div className="space-y-1">
              <Label>Mode de paiement</Label>
              <Select value={modePaiement} onValueChange={setModePaiement}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MODES_PAIEMENT.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaiementOpen(false)}>Annuler</Button>
            <Button className="bg-green-600 hover:bg-green-700" disabled={isPending || !parseInt(montantSaisi)} onClick={handlePayer}>
              <CheckCircle className="h-4 w-4" />Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
