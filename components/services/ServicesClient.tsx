"use client";

import { useState, useTransition } from "react";
import { Plus, Search, Edit, Trash2, Scissors, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createService, updateService, deleteService } from "@/lib/actions/services";
import { formatFCFA, calculerTTC, TVA_TAUX } from "@/lib/utils/formatters";
import type { Database } from "@/types/supabase";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type StockItem = { id: string; nom: string; quantite: number };
interface ServiceForm { nom: string; description: string; type: "service" | "article"; prixHT: number; tva: number; categorie: string; actif: boolean; stockId: string; }
const emptyForm: ServiceForm = { nom: "", description: "", type: "service", prixHT: 0, tva: TVA_TAUX, categorie: "", actif: true, stockId: "" };
const CATS_SERVICE = ["Tressage", "Tissage", "Coupe", "Coloration", "Lissage", "Soin", "Autre"];
const CATS_ARTICLE = ["Extension", "Produit", "Accessoire", "Autre"];

export function ServicesClient({ initialServices, stockItems }: { initialServices: ServiceRow[]; stockItems: StockItem[] }) {
  const [services, setServices] = useState(initialServices);
  const [search, setSearch] = useState("");
  const [typeFiltre, setTypeFiltre] = useState<"tous" | "service" | "article">("tous");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [isPending, startTransition] = useTransition();

  const filtered = services.filter((s) => {
    const matchSearch = s.nom.toLowerCase().includes(search.toLowerCase()) || s.categorie.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFiltre === "tous" || s.type === typeFiltre;
    return matchSearch && matchType;
  });

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModalOpen(true); };
  const openEdit = (s: ServiceRow) => {
    setForm({ nom: s.nom, description: s.description ?? "", type: s.type, prixHT: s.prix_ht, tva: s.tva, categorie: s.categorie, actif: s.actif, stockId: s.stock_id ?? "" });
    setEditId(s.id); setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.nom || !form.categorie) return;
    const prixTTC = calculerTTC(form.prixHT, form.tva);
    const stockId = form.type === "article" && form.stockId && form.stockId !== "none" ? form.stockId : null;
    startTransition(async () => {
      if (editId) {
        await updateService(editId, { ...form, prixTTC, stockId });
        setServices((prev) => prev.map((s) => s.id === editId ? { ...s, nom: form.nom, description: form.description, type: form.type, prix_ht: form.prixHT, prix_ttc: prixTTC, tva: form.tva, categorie: form.categorie, actif: form.actif, stock_id: stockId } : s));
      } else {
        await createService({ ...form, prixTTC, stockId });
        window.location.reload();
        return;
      }
      setModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce service ?")) {
      startTransition(async () => {
        await deleteService(id);
        setServices((prev) => prev.filter((s) => s.id !== id));
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Nouveau</Button>
      </div>
      <div className="flex gap-2">
        {(["tous", "service", "article"] as const).map((t) => (
          <button key={t} onClick={() => setTypeFiltre(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${typeFiltre === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
            {t === "tous" ? "Tout" : t === "service" ? "Services" : "Articles"}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nom</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Catégorie</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Prix HT</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Prix TTC</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Statut</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {s.type === "service" ? <Scissors className="h-4 w-4 text-muted-foreground" /> : <Package className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-medium">{s.nom}</span>
                  </div>
                  {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
                </td>
                <td className="px-4 py-3"><Badge variant={s.type === "service" ? "purple" : "info"}>{s.type === "service" ? "Service" : "Article"}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground">{s.categorie}</td>
                <td className="px-4 py-3 text-right">{formatFCFA(s.prix_ht)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatFCFA(s.prix_ttc)}</td>
                <td className="px-4 py-3 text-center"><Badge variant={s.actif ? "success" : "secondary"}>{s.actif ? "Actif" : "Inactif"}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editId ? "Modifier" : "Nouveau service/article"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2"><Label>Type *</Label>
              <Select value={form.type} onValueChange={(v: "service" | "article") => setForm(f => ({ ...f, type: v, categorie: "" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="service">Service</SelectItem><SelectItem value="article">Article</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2"><Label>Nom *</Label><Input value={form.nom} onChange={(e) => setForm(f => ({ ...f, nom: e.target.value }))} /></div>
            <div className="col-span-2 space-y-2"><Label>Catégorie *</Label>
              <Select value={form.categorie} onValueChange={(v) => setForm(f => ({ ...f, categorie: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>{(form.type === "service" ? CATS_SERVICE : CATS_ARTICLE).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Prix HT (FCFA) *</Label><Input type="number" min={0} value={form.prixHT} onChange={(e) => setForm(f => ({ ...f, prixHT: Number(e.target.value) }))} /></div>
            <div className="space-y-2"><Label>TVA (%)</Label><Input type="number" min={0} max={100} value={form.tva} onChange={(e) => setForm(f => ({ ...f, tva: Number(e.target.value) }))} /></div>
            <div className="col-span-2 text-sm text-muted-foreground bg-muted/40 rounded-lg p-3">Prix TTC : <strong>{formatFCFA(calculerTTC(form.prixHT, form.tva))}</strong></div>
            {form.type === "article" && stockItems.length > 0 && (
              <div className="col-span-2 space-y-2">
                <Label>Article lié au stock</Label>
                <Select value={form.stockId} onValueChange={(v) => setForm(f => ({ ...f, stockId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un produit stock..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {stockItems.map(s => <SelectItem key={s.id} value={s.id}>{s.nom} (stock: {s.quantite})</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Le stock sera décrémenté automatiquement lors de la facturation.</p>
              </div>
            )}
            <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!form.nom || !form.categorie || isPending}>{editId ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
