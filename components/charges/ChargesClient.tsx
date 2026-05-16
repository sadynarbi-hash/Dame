"use client";

import { useState, useTransition } from "react";
import { Plus, Edit, Trash2, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createCharge, updateCharge, deleteCharge } from "@/lib/actions/charges";
import { formatFCFA } from "@/lib/utils/formatters";
import type { Database } from "@/types/supabase";
import type { TypeCharge } from "@/types";

type ChargeRow = Database["public"]["Tables"]["charges"]["Row"];
interface ChargeForm { libelle: string; type: TypeCharge; montant: number; mois: number; annee: number; description: string; employe: string; }
const now = new Date();
const emptyForm: ChargeForm = { libelle: "", type: "autre", montant: 0, mois: now.getMonth() + 1, annee: now.getFullYear(), description: "", employe: "" };
const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const TYPE_CONFIG: Record<TypeCharge, { label: string; variant: "purple" | "info" | "warning" | "success" | "destructive" }> = {
  salaire: { label: "Salaire", variant: "purple" }, loyer: { label: "Loyer", variant: "info" },
  fourniture: { label: "Fourniture", variant: "warning" }, maintenance: { label: "Maintenance", variant: "success" }, autre: { label: "Autre", variant: "destructive" },
};

export function ChargesClient({ initialCharges }: { initialCharges: ChargeRow[] }) {
  const [charges, setCharges] = useState(initialCharges);
  const [moisFiltre, setMoisFiltre] = useState(now.getMonth() + 1);
  const [anneeFiltre, setAnneeFiltre] = useState(now.getFullYear());
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ChargeForm>(emptyForm);
  const [isPending, startTransition] = useTransition();

  const filtered = charges.filter(c => c.mois === moisFiltre && c.annee === anneeFiltre);
  const totalMois = filtered.reduce((s, c) => s + c.montant, 0);
  const parType = Object.entries(filtered.reduce((acc, c) => ({ ...acc, [c.type]: (acc[c.type as TypeCharge] ?? 0) + c.montant }), {} as Record<TypeCharge, number>));

  const openEdit = (c: ChargeRow) => {
    setForm({ libelle: c.libelle, type: c.type as TypeCharge, montant: c.montant, mois: c.mois, annee: c.annee, description: c.description ?? "", employe: c.employe ?? "" });
    setEditId(c.id); setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.libelle) return;
    startTransition(async () => {
      if (editId) {
        await updateCharge(editId, form);
        setCharges(prev => prev.map(c => c.id === editId ? { ...c, ...form } : c));
      } else {
        await createCharge(form);
        window.location.reload(); return;
      }
      setModalOpen(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <Select value={String(moisFiltre)} onValueChange={(v) => setMoisFiltre(Number(v))}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>{MOIS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={String(anneeFiltre)} onValueChange={(v) => setAnneeFiltre(Number(v))}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>{[2024,2025,2026,2027].map(a => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Button onClick={() => { setForm({ ...emptyForm, mois: moisFiltre, annee: anneeFiltre }); setEditId(null); setModalOpen(true); }}><Plus className="h-4 w-4" />Ajouter</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="col-span-2 sm:col-span-1"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-destructive">{formatFCFA(totalMois)}</p><p className="text-xs text-muted-foreground mt-1">Total {MOIS[moisFiltre - 1]}</p></CardContent></Card>
        {parType.map(([type, montant]) => (
          <Card key={type}><CardContent className="p-4 text-center"><p className="text-xl font-bold">{formatFCFA(montant)}</p><Badge variant={TYPE_CONFIG[type as TypeCharge].variant} className="mt-1">{TYPE_CONFIG[type as TypeCharge].label}</Badge></CardContent></Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16"><TrendingDown className="h-12 w-12 text-muted-foreground/40 mb-4" /><p className="text-muted-foreground">Aucune charge ce mois</p><Button className="mt-4" onClick={() => { setForm({ ...emptyForm, mois: moisFiltre, annee: anneeFiltre }); setEditId(null); setModalOpen(true); }}>Ajouter</Button></CardContent></Card>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Libellé</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Détail</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Montant</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.libelle}</td>
                  <td className="px-4 py-3"><Badge variant={TYPE_CONFIG[c.type as TypeCharge].variant}>{TYPE_CONFIG[c.type as TypeCharge].label}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{c.employe ?? c.description ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-destructive">{formatFCFA(c.montant)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled={isPending} onClick={() => { if(confirm("Supprimer ?")) startTransition(async () => { await deleteCharge(c.id); setCharges(prev => prev.filter(x => x.id !== c.id)); }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editId ? "Modifier" : "Nouvelle charge"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2"><Label>Libellé *</Label><Input value={form.libelle} onChange={(e) => setForm(f => ({ ...f, libelle: e.target.value }))} /></div>
            <div className="col-span-2 space-y-2"><Label>Type *</Label>
              <Select value={form.type} onValueChange={(v: TypeCharge) => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(TYPE_CONFIG).map(([v, { label }]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Montant (FCFA) *</Label><Input type="number" min={0} value={form.montant} onChange={(e) => setForm(f => ({ ...f, montant: Number(e.target.value) }))} /></div>
            <div className="space-y-2"><Label>Mois</Label>
              <Select value={String(form.mois)} onValueChange={(v) => setForm(f => ({ ...f, mois: Number(v) }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{MOIS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {form.type === "salaire" && <div className="col-span-2 space-y-2"><Label>Employé</Label><Input value={form.employe} onChange={(e) => setForm(f => ({ ...f, employe: e.target.value }))} /></div>}
            <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!form.libelle || isPending}>{editId ? "Enregistrer" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
