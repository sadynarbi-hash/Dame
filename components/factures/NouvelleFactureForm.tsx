"use client";

import { useState, useCallback, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, ArrowLeft, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createFacture } from "@/lib/actions/factures";
import { formatFCFA, calculerTTC, calculerMontantTva, TVA_TAUX } from "@/lib/utils/formatters";

type ClientRow = { id: string; nom: string; prenom: string; telephone: string | null };
type ServiceRow = { id: string; nom: string; prix_ht: number; prix_ttc: number; tva: number; type: string };
type AgentRow = { id: string; nom: string };

const ligneSchema = z.object({
  serviceId: z.string().optional(),
  agentId: z.string().optional(),
  designation: z.string().min(1, "Requis"),
  quantite: z.number().min(1),
  prixUnitaireHT: z.number().min(0),
  tva: z.number().min(0).max(100),
});

const MODES_PAIEMENT = [
  { value: "especes", label: "Espèces" },
  { value: "wave", label: "Wave" },
  { value: "orange_money", label: "Orange Money" },
  { value: "virement", label: "Virement" },
  { value: "cheque", label: "Chèque" },
];

const factureSchema = z.object({
  clientId: z.string().min(1, "Sélectionnez un client"),
  dateEmission: z.string().min(1),
  dateEcheance: z.string().min(1),
  modePaiement: z.string().optional(),
  lignes: z.array(ligneSchema).min(1),
});

type FactureForm = z.infer<typeof factureSchema>;

function newLigne(): FactureForm["lignes"][0] {
  return { designation: "", quantite: 1, prixUnitaireHT: 0, tva: TVA_TAUX, agentId: undefined };
}

function ServiceCombobox({ services, onSelect }: { services: ServiceRow[]; onSelect: (s: ServiceRow) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.length === 0 ? services : services.filter(s => s.nom.toLowerCase().includes(query.toLowerCase()));
  const servicesList = filtered.filter(s => s.type === "service");
  const articlesList = filtered.filter(s => s.type === "article");

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-8 text-xs pl-7"
          placeholder="Chercher service/article..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-60 overflow-y-auto text-xs">
          {servicesList.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide bg-muted/50">Services</div>
              {servicesList.map(s => (
                <button key={s.id} type="button" className="w-full text-left px-3 py-2 hover:bg-accent flex items-center justify-between gap-2"
                  onMouseDown={() => { onSelect(s); setQuery(s.nom); setOpen(false); }}>
                  <span>{s.nom}</span>
                  <span className="text-muted-foreground shrink-0">{formatFCFA(s.prix_ht)} HT</span>
                </button>
              ))}
            </>
          )}
          {articlesList.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide bg-muted/50">Articles</div>
              {articlesList.map(s => (
                <button key={s.id} type="button" className="w-full text-left px-3 py-2 hover:bg-accent flex items-center justify-between gap-2"
                  onMouseDown={() => { onSelect(s); setQuery(s.nom); setOpen(false); }}>
                  <span>{s.nom}</span>
                  <span className="text-muted-foreground shrink-0">{formatFCFA(s.prix_ht)} HT</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function NouvelleFactureForm({ clients, services, agents }: { clients: ClientRow[]; services: ServiceRow[]; agents: AgentRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const echeanceDefaut = new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0];

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FactureForm>({
    resolver: zodResolver(factureSchema),
    defaultValues: {
      clientId: "", dateEmission: today, dateEcheance: echeanceDefaut,
      lignes: [newLigne()],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lignes" });
  const lignesWatched = watch("lignes");

  const getTotaux = useCallback(() => {
    const sousTotal = lignesWatched.reduce((s, l) => s + (l.prixUnitaireHT * l.quantite), 0);
    const montantTva = lignesWatched.reduce((s, l) => s + calculerMontantTva(l.prixUnitaireHT * l.quantite, l.tva), 0);
    return { sousTotal, montantTva, totalTTC: sousTotal + montantTva };
  }, [lignesWatched]);

  const { sousTotal, montantTva, totalTTC } = getTotaux();

  const onSubmit = (data: FactureForm) => {
    setServerError(null);
    const { sousTotal, montantTva, totalTTC } = getTotaux();
    const lignes = data.lignes.map((l) => ({
      serviceId: l.serviceId,
      agentId: l.agentId,
      designation: l.designation,
      quantite: l.quantite,
      prixUnitaireHT: l.prixUnitaireHT,
      tva: l.tva,
      totalHT: l.prixUnitaireHT * l.quantite,
      totalTTC: calculerTTC(l.prixUnitaireHT * l.quantite, l.tva),
    }));

    startTransition(async () => {
      const result = await createFacture({ clientId: data.clientId, dateEmission: data.dateEmission, dateEcheance: data.dateEcheance, modePaiement: data.modePaiement, lignes, sousTotal, montantTva, totalTTC });
      if (result?.error) setServerError(result.error);
    });
  };

  const handleServiceSelect = (index: number, serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;
    setValue(`lignes.${index}.serviceId`, serviceId);
    setValue(`lignes.${index}.designation`, service.nom);
    setValue(`lignes.${index}.prixUnitaireHT`, service.prix_ht);
    setValue(`lignes.${index}.tva`, service.tva);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h2 className="text-xl font-semibold">Nouvelle facture</h2>
          <p className="text-sm text-muted-foreground">Remplissez les informations ci-dessous</p>
        </div>
      </div>

      {serverError && <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">{serverError}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3 space-y-2">
              <Label>Client *</Label>
              <Select onValueChange={(v) => setValue("clientId", v)}>
                <SelectTrigger className={errors.clientId ? "border-destructive" : ""}><SelectValue placeholder="Sélectionner un client..." /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.prenom} {c.nom}{c.telephone ? ` — ${c.telephone}` : ""}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.clientId && <p className="text-xs text-destructive">{errors.clientId.message}</p>}
            </div>
            <div className="space-y-2"><Label>Date d&apos;émission *</Label><Input type="date" {...register("dateEmission")} /></div>
            <div className="space-y-2"><Label>Date d&apos;échéance *</Label><Input type="date" {...register("dateEcheance")} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lignes de facturation</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => append(newLigne())}><Plus className="h-4 w-4" />Ajouter une ligne</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
              <div className="col-span-4">Désignation</div>
              <div className="col-span-2">Agent</div>
              <div className="col-span-1">Qté</div>
              <div className="col-span-2">Prix HT</div>
              <div className="col-span-1">TVA %</div>
              <div className="col-span-1 text-right">Total TTC</div>
              <div className="col-span-1"></div>
            </div>

            {fields.map((field, index) => {
              const ligne = lignesWatched[index];
              const totalHT = (ligne?.prixUnitaireHT ?? 0) * (ligne?.quantite ?? 0);
              const lineTTC = calculerTTC(totalHT, ligne?.tva ?? TVA_TAUX);

              return (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-start rounded-lg border p-3 bg-muted/20">
                  <div className="col-span-12 sm:col-span-4 space-y-1">
                    <ServiceCombobox services={services} onSelect={(s) => handleServiceSelect(index, s.id)} />
                    <Input placeholder="Désignation" className="h-8 text-sm" {...register(`lignes.${index}.designation`)} />
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    <Select value={ligne?.agentId ?? "none"} onValueChange={(v) => setValue(`lignes.${index}.agentId`, v === "none" ? undefined : v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Agent…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— Aucun —</SelectItem>
                        {agents.map(a => <SelectItem key={a.id} value={a.id}>{a.nom}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 sm:col-span-1"><Input type="number" min={1} className="h-8 text-sm" {...register(`lignes.${index}.quantite`, { valueAsNumber: true })} /></div>
                  <div className="col-span-4 sm:col-span-2"><Input type="number" min={0} className="h-8 text-sm" {...register(`lignes.${index}.prixUnitaireHT`, { valueAsNumber: true })} /></div>
                  <div className="col-span-2 sm:col-span-1"><Input type="number" min={0} max={100} className="h-8 text-sm" {...register(`lignes.${index}.tva`, { valueAsNumber: true })} /></div>
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-end"><span className="text-sm font-semibold">{formatFCFA(lineTTC)}</span></div>
                  <div className="col-span-2 sm:col-span-1 flex justify-end">
                    {fields.length > 1 && <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(index)}><Trash2 className="h-3.5 w-3.5" /></Button>}
                  </div>
                </div>
              );
            })}

            <Separator />
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="w-full sm:w-56 space-y-1">
                <Label className="text-xs text-muted-foreground">Mode de paiement</Label>
                <Select onValueChange={(v) => setValue("modePaiement", v === "none" ? undefined : v)}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Non précisé —</SelectItem>
                    {MODES_PAIEMENT.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sous-total HT</span><span>{formatFCFA(sousTotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">TVA ({TVA_TAUX}%)</span><span>{formatFCFA(montantTva)}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span>Total TTC</span><span className="text-primary">{formatFCFA(totalTTC)}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
          <Button type="submit" disabled={isPending}><Save className="h-4 w-4" />{isPending ? "Enregistrement..." : "Enregistrer la facture"}</Button>
        </div>
      </form>
    </div>
  );
}
