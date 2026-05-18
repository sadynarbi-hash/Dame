"use client";

import { useState, useTransition } from "react";
import { Plus, Search, Users, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createClient_, updateClient, deleteClient } from "@/lib/actions/clients";
import { formatFCFA, formatDate, formatAnniversaire } from "@/lib/utils/formatters";
import type { Database } from "@/types/supabase";

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
interface ClientForm { nom: string; prenom: string; email: string; telephone: string; adresse: string; notes: string; date_naissance: string; }
const emptyForm: ClientForm = { nom: "", prenom: "", email: "", telephone: "", adresse: "", notes: "", date_naissance: "" };

function exportCSV(clients: ClientRow[]) {
  const headers = ["Prénom", "Nom", "Téléphone", "Email", "Adresse", "Anniversaire", "Nb factures", "Total dépensé (FCFA)", "Dernière visite", "Notes"];
  const rows = clients.map(c => [
    c.prenom, c.nom, c.telephone, c.email ?? "", c.adresse ?? "",
    c.date_naissance ? formatAnniversaire(c.date_naissance) : "",
    c.nb_factures ?? 0, c.total_depense ?? 0,
    c.derniere_visite ? formatDate(c.derniere_visite) : "",
    (c.notes ?? "").replace(/\n/g, " "),
  ]);
  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(";"))
    .join("\n");
  const bom = "﻿"; // BOM pour Excel FR
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `clients_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

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
        window.location.reload(); return;
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
    <div className="space-y-4">
      {/* Barre de recherche + actions */}
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un client..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportCSV(filtered)} disabled={filtered.length === 0}>
            <Download className="h-4 w-4" />Exporter Excel
          </Button>
          <Button onClick={openCreate}><Plus className="h-4 w-4" />Nouveau client</Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} client(s)</p>

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16">
          <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Aucun client</p>
          <Button className="mt-4" onClick={openCreate}>Ajouter</Button>
        </CardContent></Card>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Client</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Téléphone</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Anniversaire</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Factures</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total dépensé</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dernière visite</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((client) => (
                  <tr key={client.id} className="hover:bg-muted/20 transition-colors">
                    {/* Client */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                          {client.prenom[0]}{client.nom[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-800">{client.prenom} {client.nom}</p>
                          {client.adresse && <p className="text-xs text-muted-foreground truncate max-w-[160px]">{client.adresse}</p>}
                        </div>
                      </div>
                    </td>
                    {/* Téléphone */}
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{client.telephone}</td>
                    {/* Email */}
                    <td className="px-4 py-3 text-muted-foreground max-w-[180px]">
                      <span className="truncate block">{client.email ?? "—"}</span>
                    </td>
                    {/* Anniversaire */}
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {client.date_naissance ? formatAnniversaire(client.date_naissance) : "—"}
                    </td>
                    {/* Nb factures */}
                    <td className="px-4 py-3 text-center font-semibold">{client.nb_factures ?? 0}</td>
                    {/* Total dépensé */}
                    <td className="px-4 py-3 text-right font-bold text-primary whitespace-nowrap">
                      {formatFCFA(client.total_depense ?? 0)}
                    </td>
                    {/* Dernière visite */}
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {client.derniere_visite ? formatDate(client.derniere_visite) : "—"}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(client)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(client.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal création / édition */}
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
            <div className="col-span-2 space-y-2">
              <Label>Date anniversaire</Label>
              <div className="flex gap-2">
                <select className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.date_naissance ? form.date_naissance.split("-")[2] : ""}
                  onChange={(e) => {
                    const jour = e.target.value;
                    const mois = form.date_naissance ? form.date_naissance.split("-")[1] : "01";
                    setForm(f => ({ ...f, date_naissance: jour ? `1900-${mois}-${jour}` : "" }));
                  }}>
                  <option value="">Jour</option>
                  {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")).map(j => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
                <select className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.date_naissance ? form.date_naissance.split("-")[1] : ""}
                  onChange={(e) => {
                    const mois = e.target.value;
                    const jour = form.date_naissance ? form.date_naissance.split("-")[2] : "01";
                    setForm(f => ({ ...f, date_naissance: mois ? `1900-${mois}-${jour || "01"}` : "" }));
                  }}>
                  <option value="">Mois</option>
                  {["01","02","03","04","05","06","07","08","09","10","11","12"].map((m, i) => (
                    <option key={m} value={m}>{["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"][i]}</option>
                  ))}
                </select>
              </div>
            </div>
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
