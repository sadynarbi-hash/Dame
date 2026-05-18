"use client";

import { useState, useTransition } from "react";
import { createMembre, updateMembre, deleteMembre } from "@/lib/actions/membres";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Pencil, Trash2, CheckCircle, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import type { Permissions } from "@/lib/auth/context";

const PERM_LABELS: { key: keyof Permissions; label: string }[] = [
  { key: "dashboard", label: "Tableau de bord" },
  { key: "factures", label: "Factures" },
  { key: "clients", label: "Clients" },
  { key: "rendez_vous", label: "Rendez-vous" },
  { key: "agents", label: "Agents" },
  { key: "services", label: "Services" },
  { key: "stock", label: "Stock" },
  { key: "charges", label: "Charges" },
  { key: "parametres", label: "Paramètres" },
];

const ROLE_LABELS: Record<string, string> = {
  gerant: "Gérant",
  caissier: "Caissier",
  personnel: "Personnel",
};

const DEFAULT_PERMS: Permissions = {
  dashboard: true, factures: true, clients: true, rendez_vous: true,
  agents: false, services: false, stock: false, charges: false, parametres: false,
};

type Membre = {
  id: string; email: string; nom: string; role: string;
  permissions: Permissions; actif: boolean; created_at: string;
  membre_user_id: string | null;
};

type FormState = {
  email: string; nom: string; role: string; permissions: Permissions;
};

export function MembresClient({ initialMembres }: { initialMembres: Membre[] }) {
  const [membres, setMembres] = useState(initialMembres);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ email: "", nom: "", role: "personnel", permissions: { ...DEFAULT_PERMS } });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const openAdd = () => {
    setEditingId(null);
    setForm({ email: "", nom: "", role: "personnel", permissions: { ...DEFAULT_PERMS } });
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (m: Membre) => {
    setEditingId(m.id);
    setForm({ email: m.email, nom: m.nom, role: m.role, permissions: { ...m.permissions } });
    setError("");
    setDialogOpen(true);
  };

  const togglePerm = (key: keyof Permissions) => {
    setForm(f => ({ ...f, permissions: { ...f.permissions, [key]: !f.permissions[key] } }));
  };

  const handleSave = () => {
    if (!form.nom.trim()) { setError("Le nom est requis"); return; }
    if (!editingId && !form.email.trim()) { setError("L'email est requis"); return; }

    setError("");
    startTransition(async () => {
      if (editingId) {
        const res = await updateMembre(editingId, { nom: form.nom, role: form.role, permissions: form.permissions });
        if (res && "error" in res) { setError(res.error ?? "Erreur"); return; }
        setMembres(prev => prev.map(m => m.id === editingId ? { ...m, nom: form.nom, role: form.role, permissions: form.permissions } : m));
      } else {
        const res = await createMembre({ email: form.email, nom: form.nom, role: form.role, permissions: form.permissions });
        if (res && "error" in res) { setError(res.error ?? "Erreur"); return; }
        window.location.reload();
      }
      setDialogOpen(false);
    });
  };

  const handleDelete = (id: string, nom: string) => {
    if (!confirm(`Supprimer l'utilisateur "${nom}" ?`)) return;
    startTransition(async () => {
      await deleteMembre(id);
      setMembres(prev => prev.filter(m => m.id !== id));
    });
  };

  const handleToggleActif = (m: Membre) => {
    startTransition(async () => {
      await updateMembre(m.id, { actif: !m.actif });
      setMembres(prev => prev.map(x => x.id === m.id ? { ...x, actif: !x.actif } : x));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Utilisateurs du salon</h1>
          <p className="text-sm text-muted-foreground">Gérez les accès et les permissions de votre équipe</p>
        </div>
        <Button onClick={openAdd}>
          <UserPlus className="h-4 w-4" />Ajouter un utilisateur
        </Button>
      </div>

      {membres.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
          Aucun utilisateur ajouté. Cliquez sur &quot;Ajouter un utilisateur&quot; pour commencer.
        </div>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nom</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rôle</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Compte</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {membres.map((m) => (
                <tr key={m.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{m.nom}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{ROLE_LABELS[m.role] ?? m.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActif(m)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                    >
                      {m.actif ? (
                        <><ToggleRight className="h-5 w-5 text-green-500" /><span className="text-green-600">Actif</span></>
                      ) : (
                        <><ToggleLeft className="h-5 w-5 text-gray-400" /><span className="text-muted-foreground">Inactif</span></>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {m.membre_user_id ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />Connecté
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-orange-500">
                        <Clock className="h-3 w-3" />En attente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(m)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-600" onClick={() => handleDelete(m.id, m.nom)} disabled={isPending}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {!editingId && (
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="utilisateur@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">L&apos;utilisateur doit créer un compte avec cet email pour accéder au salon.</p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" placeholder="Prénom Nom" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label>Rôle</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gerant">Gérant</SelectItem>
                  <SelectItem value="caissier">Caissier</SelectItem>
                  <SelectItem value="personnel">Personnel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Permissions (sections visibles)</Label>
              <div className="grid grid-cols-2 gap-2 rounded-lg border p-3">
                {PERM_LABELS.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer select-none py-1">
                    <input
                      type="checkbox"
                      checked={form.permissions[key]}
                      onChange={() => togglePerm(key)}
                      className="h-4 w-4 rounded border-gray-300 text-primary"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button className="flex-1" onClick={handleSave} disabled={isPending}>
                {isPending ? "..." : editingId ? "Enregistrer" : "Ajouter"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
