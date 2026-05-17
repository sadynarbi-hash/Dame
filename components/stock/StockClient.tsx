"use client";

import { useState, useTransition } from "react";
import { Plus, Search, AlertTriangle, Edit, Trash2, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateArticleStock, deleteArticleStock, ajusterQuantite, entreeStockService } from "@/lib/actions/stock";
import { formatFCFA } from "@/lib/utils/formatters";
import type { Database } from "@/types/supabase";

type StockRow = Database["public"]["Tables"]["stock"]["Row"];
interface StockForm { nom: string; reference: string; categorie: string; quantite: number; unite: string; seuilAlerte: number; prixAchat: number; fournisseur: string; }
const emptyForm: StockForm = { nom: "", reference: "", categorie: "", quantite: 0, unite: "unité", seuilAlerte: 3, prixAchat: 0, fournisseur: "" };
const UNITES = ["unité", "litre", "kg", "flacon", "boîte"];

type ArticleService = { id: string; nom: string; stock_id: string | null };

export function StockClient({ initialStock, articles }: { initialStock: StockRow[]; articles: ArticleService[] }) {
  const [stock, setStock] = useState(initialStock);
  const [search, setSearch] = useState("");
  const [filtreAlertes, setFiltreAlertes] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<StockForm>(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [entreeOpen, setEntreeOpen] = useState(false);
  const [entreeArticleId, setEntreeArticleId] = useState<string>("");
  const [entreeQte, setEntreeQte] = useState<number>(1);
  const [entreePrixAchat, setEntreePrixAchat] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const filtered = stock.filter((a) => {
    const matchSearch = a.nom.toLowerCase().includes(search.toLowerCase()) || a.categorie.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (!filtreAlertes || a.quantite <= a.seuil_alerte);
  });
  const alertes = stock.filter(a => a.quantite <= a.seuil_alerte);

  const openEdit = (a: StockRow) => {
    setForm({ nom: a.nom, reference: a.reference ?? "", categorie: a.categorie, quantite: a.quantite, unite: a.unite, seuilAlerte: a.seuil_alerte, prixAchat: a.prix_achat, fournisseur: a.fournisseur ?? "" });
    setEditId(a.id); setModalOpen(true);
  };

  const handleSave = () => {
    if (!editId || !form.nom || !form.categorie) return;
    startTransition(async () => {
      await updateArticleStock(editId, form);
      setStock(prev => prev.map(a => a.id === editId ? { ...a, nom: form.nom, reference: form.reference, categorie: form.categorie, quantite: form.quantite, unite: form.unite as StockRow["unite"], seuil_alerte: form.seuilAlerte, prix_achat: form.prixAchat, fournisseur: form.fournisseur } : a));
      setModalOpen(false);
    });
  };

  const handleAjuster = (id: string, delta: number) => {
    startTransition(async () => {
      await ajusterQuantite(id, delta);
      setStock(prev => prev.map(a => a.id === id ? { ...a, quantite: Math.max(0, a.quantite + delta) } : a));
    });
  };

  return (
    <div className="space-y-6">
      {alertes.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-800"><strong>{alertes.length} article(s)</strong> en stock faible : {alertes.map(a => a.nom).join(", ")}</p>
          </CardContent>
        </Card>
      )}
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <button onClick={() => setFiltreAlertes(!filtreAlertes)} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${filtreAlertes ? "bg-orange-500 text-white" : "bg-secondary text-secondary-foreground"}`}>
            <AlertTriangle className="h-3.5 w-3.5" />Alertes
          </button>
        </div>
        <Button onClick={() => { setEntreeArticleId(""); setEntreeQte(1); setEntreePrixAchat(0); setEntreeOpen(true); }}><Plus className="h-4 w-4" />Entrée en stock</Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Article</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Catégorie</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Quantité</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Seuil</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Prix achat</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fournisseur</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((a) => {
              const enAlerte = a.quantite <= a.seuil_alerte;
              return (
                <tr key={a.id} className={`hover:bg-muted/30 ${enAlerte ? "bg-orange-50/50" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {enAlerte && <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0" />}
                      <div><p className="font-medium">{a.nom}</p>{a.reference && <p className="text-xs text-muted-foreground font-mono">{a.reference}</p>}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.categorie}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isPending} onClick={() => handleAjuster(a.id, -1)}><Minus className="h-3 w-3" /></Button>
                      <span className={`font-semibold min-w-[2rem] text-center ${enAlerte ? "text-orange-600" : ""}`}>{a.quantite} {a.unite}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isPending} onClick={() => handleAjuster(a.id, 1)}><Plus className="h-3 w-3" /></Button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{a.seuil_alerte} {a.unite}</td>
                  <td className="px-4 py-3 text-right">{formatFCFA(a.prix_achat)}</td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{a.fournisseur ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(a)}><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { if(confirm("Supprimer ?")) startTransition(async () => { await deleteArticleStock(a.id); setStock(prev => prev.filter(x => x.id !== a.id)); }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={entreeOpen} onOpenChange={setEntreeOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Entrée en stock</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Article *</Label>
              {articles.length === 0 ? (
                <p className="text-sm text-muted-foreground rounded-md border p-3">Aucun article trouvé. Créez d&apos;abord un article dans l&apos;onglet <strong>Services</strong>.</p>
              ) : (
                <Select value={entreeArticleId} onValueChange={setEntreeArticleId}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un article…" /></SelectTrigger>
                  <SelectContent>
                    {articles.map(a => {
                      const stockItem = stock.find(s => s.id === a.stock_id);
                      return (
                        <SelectItem key={a.id} value={a.id}>
                          {a.nom}{stockItem ? ` — stock actuel : ${stockItem.quantite} ${stockItem.unite}` : " — nouveau"}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label>Quantité à ajouter *</Label>
              <Input type="number" min={1} value={entreeQte} onChange={(e) => setEntreeQte(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Prix d&apos;achat unitaire (FCFA)</Label>
              <Input type="number" min={0} value={entreePrixAchat} onChange={(e) => setEntreePrixAchat(Number(e.target.value))} placeholder="0" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEntreeOpen(false)}>Annuler</Button>
            <Button
              disabled={!entreeArticleId || entreeQte <= 0 || isPending || articles.length === 0}
              onClick={() => {
                startTransition(async () => {
                  await entreeStockService(entreeArticleId, entreeQte, entreePrixAchat || undefined);
                  window.location.reload();
                });
              }}
            >
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Modifier l&apos;article</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2"><Label>Nom *</Label><Input value={form.nom} onChange={(e) => setForm(f => ({ ...f, nom: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Référence</Label><Input value={form.reference} onChange={(e) => setForm(f => ({ ...f, reference: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Catégorie *</Label><Input value={form.categorie} onChange={(e) => setForm(f => ({ ...f, categorie: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Quantité</Label><Input type="number" min={0} value={form.quantite} onChange={(e) => setForm(f => ({ ...f, quantite: Number(e.target.value) }))} /></div>
            <div className="space-y-2"><Label>Unité</Label>
              <Select value={form.unite} onValueChange={(v) => setForm(f => ({ ...f, unite: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{UNITES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Seuil d&apos;alerte</Label><Input type="number" min={0} value={form.seuilAlerte} onChange={(e) => setForm(f => ({ ...f, seuilAlerte: Number(e.target.value) }))} /></div>
            <div className="space-y-2"><Label>Prix achat (FCFA)</Label><Input type="number" min={0} value={form.prixAchat} onChange={(e) => setForm(f => ({ ...f, prixAchat: Number(e.target.value) }))} /></div>
            <div className="col-span-2 space-y-2"><Label>Fournisseur</Label><Input value={form.fournisseur} onChange={(e) => setForm(f => ({ ...f, fournisseur: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!form.nom || !form.categorie || isPending}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
