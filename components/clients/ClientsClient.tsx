"use client";

import { useState, useTransition } from "react";
import { Plus, Search, Users, Phone, Mail, Edit, Trash2, Cake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createClient_, updateClient, deleteClient } from "@/lib/actions/clients";
import { formatFCFA, formatDate } from "@/lib/utils/formatters";
import type { Database } from "@/types/supabase";

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
interface ClientForm { nom: string; prenom: string; email: string; telephone: string; adresse: string; notes: string; date_naissance: string; }
const emptyForm: ClientForm = { nom: "", prenom: "", email: "", telephone: "", adresse: "", notes: "", date_naissance: "" };

export function ClientsClient({ initialClients }: { initialClients: ClientRow[] }) {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return `${c.prenom} ${c.nom}`.toLowerCase().includes(q) || c.telephone?.includes(q) || c.email?.toLowerCase().includes(q);
  });

  const openCreate = () => { setForm(emptyForm); setEditId(null); setError(null); setModalOpen(true); };
  const openEdit = (c: ClientRow) => {
    setForm({ nom: c.nom, prenom: c.prenom, email: c.email ?? "", telephone: c.telephone, adresse: c.adresse ?? "", notes: c.notes ?? "", date_naissance: c.date_naissance ?? "" });
    setEditId(c.id); setError(null); setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.nom || !form.telephone) return;
    startTransition(async () => {
      if (editId) {
        const result = await updateClient(editId, { ...form, date_naissance: form.date_naissance || null });
        if (result?.error) { setError(result.error); return; }
        setClients((prev) => prev.map((c) => c.id === editId ? { ...c, ...form } : c));
      } else {
        const result = await createClient_({ ...form, date_naissance: form.date_naissance || null });
        if (result?.error) { setError(result.error); return; }
        // Optimistic: reload page for new client (ID comes from DB)
        window.location.reload();
        return;
      }
      setModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce client ?")) {
      startTransition(async () => {
        const result = await deleteClient(id);
        if (result?.error) { alert(result.error); return; }
        setClients((prev) => prev.filter((c) => c.id !== id));
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un client..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Nouveau client</Button>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} client(s)</p>

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16"><Users className="h-12 w-12 text-muted-foreground/40 mb-4" /><p className="text-muted-foreground">Aucun client</p><Button className="mt-4" onClick={openCreate}>Ajouter</Button></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {client.prenom[0]}{client.nom[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{client.prenom} {client.nom}</p>
                      {client.derniere_visite && <p className="text-xs text-muted-foreground">Dernière visite : {formatDate(client.derniere_visite)}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(client)}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(client.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" /><span>{client.telephone}</span></div>
                  {client.email && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-3.5 w-3.5" /><span className="truncate">{client.email}</span></div>}
                  {client.date_naissance && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Cake className="h-3.5 w-3.5" /><span>{formatDate(client.date_naissance)}</span></div>}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-center"><p className="text-lg font-bold">{client.nb_factures}</p><p className="text-xs text-muted-foreground">Facture(s)</p></div>
                  <div className="text-center"><p className="text-lg font-bold text-primary">{formatFCFA(client.total_depense)}</p><p className="text-xs text-muted-foreground">Total dépensé</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editId ? "Modifier le client" : "Nouveau client"}</DialogTitle></DialogHeader>
          {error && <p className="text-sm text-destructive bg-destructive/10 rounded p-2">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Prénom *</Label><Input value={form.prenom} onChange={(e) => setForm(f => ({ ...f, prenom: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Nom *</Label><Input value={form.nom} onChange={(e) => setForm(f => ({ ...f, nom: e.target.value }))} /></div>
            <div className="col-span-2 space-y-2"><Label>Téléphone *</Label><Input value={form.telephone} onChange={(e) => setForm(f => ({ ...f, telephone: e.target.value }))} placeholder="+221 77 000 00 00" /></div>
            <div className="col-span-2 space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="col-span-2 space-y-2"><Label>Adresse</Label><Input value={form.adresse} onChange={(e) => setForm(f => ({ ...f, adresse: e.target.value }))} /></div>
            <div className="col-span-2 space-y-2"><Label>Date de naissance</Label><Input type="date" value={form.date_naissance} onChange={(e) => setForm(f => ({ ...f, date_naissance: e.target.value }))} /></div>
            <div className="col-span-2 space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!form.nom || !form.telephone || isPending}>{isPending ? "..." : editId ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
