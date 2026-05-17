"use client";

import { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createAgent, updateAgent, deleteAgent } from "@/lib/actions/agents";
import type { Database } from "@/types/supabase";

type AgentRow = Database["public"]["Tables"]["agents"]["Row"];

export function AgentsClient({ initialAgents }: { initialAgents: AgentRow[] }) {
  const [agents, setAgents] = useState(initialAgents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nom, setNom] = useState("");
  const [isPending, startTransition] = useTransition();

  const openCreate = () => { setNom(""); setEditId(null); setModalOpen(true); };
  const openEdit = (a: AgentRow) => { setNom(a.nom); setEditId(a.id); setModalOpen(true); };

  const handleSave = () => {
    if (!nom.trim()) return;
    startTransition(async () => {
      if (editId) {
        await updateAgent(editId, nom.trim());
        setAgents(prev => prev.map(a => a.id === editId ? { ...a, nom: nom.trim() } : a));
      } else {
        await createAgent(nom.trim());
        window.location.reload();
        return;
      }
      setModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Désactiver cet agent ?")) return;
    startTransition(async () => {
      await deleteAgent(id);
      setAgents(prev => prev.filter(a => a.id !== id));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{agents.length} agent(s)</p>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Nouvel agent</Button>
      </div>

      {agents.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16">
          <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Aucun agent. Ajoutez votre première agente.</p>
          <Button className="mt-4" onClick={openCreate}>Ajouter</Button>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map(a => (
            <Card key={a.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {a.nom.slice(0, 2).toUpperCase()}
                  </div>
                  <p className="font-semibold">{a.nom}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(a)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>{editId ? "Modifier l'agent" : "Nouvel agent"}</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label>Nom *</Label>
            <Input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex : Sena, Woli, Mbathio…" autoFocus />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!nom.trim() || isPending}>{editId ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
