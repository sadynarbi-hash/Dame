"use client";

import { useState, useTransition } from "react";
import { Plus, Calendar, Clock, Edit, Trash2, CheckCircle, XCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatutRdvBadge } from "@/components/shared/StatutBadge";
import { createRendezVous, updateRendezVous, deleteRendezVous } from "@/lib/actions/rendez-vous";
import { formatFCFA, formatHeure } from "@/lib/utils/formatters";
import type { StatutRendezVous } from "@/types";

type ClientRow = { id: string; nom: string; prenom: string };
type ServiceRow = { id: string; nom: string; prix_ttc: number };
type RdvRow = {
  id: string; date: string; heure_debut: string; heure_fin: string;
  statut: StatutRendezVous; montant_estime: number; notes: string | null;
  client: ClientRow | null;
  services: { service_id: string }[];
};

const today = new Date().toISOString().split("T")[0];
interface RdvForm { clientId: string; serviceIds: string[]; date: string; heureDebut: string; heureFin: string; statut: StatutRendezVous; notes: string; montantEstime: number; }
const emptyForm: RdvForm = { clientId: "", serviceIds: [], date: today, heureDebut: "09:00", heureFin: "10:00", statut: "en_attente", notes: "", montantEstime: 0 };

export function RendezVousClient({ initialRdv, clients, services }: { initialRdv: RdvRow[]; clients: ClientRow[]; services: ServiceRow[] }) {
  const [rdvs, setRdvs] = useState(initialRdv);
  const [dateFiltre, setDateFiltre] = useState<"aujourd_hui" | "semaine" | "tous">("semaine");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<RdvForm>(emptyForm);
  const [isPending, startTransition] = useTransition();

  const filtered = rdvs.filter((r) => {
    const now = new Date().toISOString().split("T")[0];
    return dateFiltre === "tous" || (dateFiltre === "aujourd_hui" && r.date === now) || (dateFiltre === "semaine" && r.date >= now);
  }).sort((a, b) => a.date.localeCompare(b.date) || a.heure_debut.localeCompare(b.heure_debut));

  const openEdit = (r: RdvRow) => {
    setForm({ clientId: r.client?.id ?? "", serviceIds: r.services.map(s => s.service_id), date: r.date, heureDebut: r.heure_debut, heureFin: r.heure_fin, statut: r.statut, notes: r.notes ?? "", montantEstime: r.montant_estime });
    setEditId(r.id); setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.clientId || !form.date) return;
    startTransition(async () => {
      if (editId) {
        await updateRendezVous(editId, { clientId: form.clientId, serviceIds: form.serviceIds, date: form.date, heureDebut: form.heureDebut, heureFin: form.heureFin, statut: form.statut, montantEstime: form.montantEstime, notes: form.notes });
        setRdvs(prev => prev.map(r => r.id === editId ? { ...r, date: form.date, heure_debut: form.heureDebut, heure_fin: form.heureFin, statut: form.statut, montant_estime: form.montantEstime, notes: form.notes, client: clients.find(c => c.id === form.clientId) ?? null, services: form.serviceIds.map(id => ({ service_id: id })) } : r));
      } else {
        await createRendezVous(form);
        window.location.reload(); return;
      }
      setModalOpen(false);
    });
  };

  const handleStatut = (id: string, statut: StatutRendezVous) => {
    startTransition(async () => {
      await updateRendezVous(id, { statut });
      setRdvs(prev => prev.map(r => r.id === id ? { ...r, statut } : r));
    });
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const rappels = rdvs.filter(r => (r.date === todayStr || r.date === tomorrowStr) && !["annule", "termine"].includes(r.statut))
    .sort((a, b) => a.date.localeCompare(b.date) || a.heure_debut.localeCompare(b.heure_debut));

  return (
    <div className="space-y-6">
      {rappels.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 space-y-3">
          <div className="flex items-center gap-2 text-orange-700 font-semibold">
            <Bell className="h-4 w-4" />
            <span>Rappels — {rappels.filter(r => r.date === todayStr).length} aujourd&apos;hui, {rappels.filter(r => r.date === tomorrowStr).length} demain</span>
          </div>
          <div className="space-y-2">
            {rappels.map(r => (
              <div key={r.id} className="flex items-center gap-3 text-sm bg-white rounded-lg px-3 py-2 border border-orange-100">
                <div className="w-16 text-center">
                  <p className="text-xs font-medium text-orange-600">{r.date === todayStr ? "Aujourd'hui" : "Demain"}</p>
                  <p className="font-bold text-orange-700">{formatHeure(r.heure_debut)}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{r.client ? `${r.client.prenom} ${r.client.nom}` : "—"}</p>
                  <p className="text-xs text-muted-foreground">{formatHeure(r.heure_debut)} — {formatHeure(r.heure_fin)}</p>
                </div>
                <StatutRdvBadge statut={r.statut} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 justify-between">
        <div className="flex gap-2">
          {(["aujourd_hui", "semaine", "tous"] as const).map((f) => (
            <button key={f} onClick={() => setDateFiltre(f)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${dateFiltre === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {f === "aujourd_hui" ? "Aujourd'hui" : f === "semaine" ? "À venir" : "Tous"}
            </button>
          ))}
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setModalOpen(true); }}><Plus className="h-4 w-4" />Nouveau RDV</Button>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16"><Calendar className="h-12 w-12 text-muted-foreground/40 mb-4" /><p className="text-muted-foreground">Aucun rendez-vous</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((rdv) => {
            const rdvServices = services.filter(s => rdv.services.some(rs => rs.service_id === s.id));
            return (
              <Card key={rdv.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center rounded-xl bg-primary/10 p-3 min-w-[60px]">
                        <p className="text-xs font-medium text-primary uppercase">{new Date(rdv.date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short" })}</p>
                        <p className="text-xl font-bold text-primary">{rdv.date.split("-")[2]}</p>
                        <p className="text-xs text-muted-foreground">{new Date(rdv.date + "T00:00:00").toLocaleDateString("fr-FR", { month: "short" })}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-lg">{rdv.client ? `${rdv.client.prenom} ${rdv.client.nom}` : "—"}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-3.5 w-3.5" />{formatHeure(rdv.heure_debut)} — {formatHeure(rdv.heure_fin)}</div>
                        {rdvServices.length > 0 && <p className="text-sm text-muted-foreground">{rdvServices.map(s => s.nom).join(", ")}</p>}
                        {rdv.notes && <p className="text-sm text-muted-foreground italic">{rdv.notes}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatutRdvBadge statut={rdv.statut} />
                      <p className="font-semibold text-primary">{formatFCFA(rdv.montant_estime)}</p>
                      <div className="flex gap-1">
                        {rdv.statut === "en_attente" && <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" disabled={isPending} onClick={() => handleStatut(rdv.id, "confirme")}><CheckCircle className="h-4 w-4" /></Button>}
                        {!["annule", "termine"].includes(rdv.statut) && <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" disabled={isPending} onClick={() => handleStatut(rdv.id, "annule")}><XCircle className="h-4 w-4" /></Button>}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(rdv)}><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled={isPending} onClick={() => { if(confirm("Supprimer ?")) startTransition(async () => { await deleteRendezVous(rdv.id); setRdvs(prev => prev.filter(r => r.id !== rdv.id)); }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editId ? "Modifier le RDV" : "Nouveau rendez-vous"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2"><Label>Client *</Label>
              <Select value={form.clientId} onValueChange={(v) => setForm(f => ({ ...f, clientId: v }))}>
                <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.prenom} {c.nom}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2"><Label>Date *</Label><Input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Heure début</Label><Input type="time" value={form.heureDebut} onChange={(e) => setForm(f => ({ ...f, heureDebut: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Heure fin</Label><Input type="time" value={form.heureFin} onChange={(e) => setForm(f => ({ ...f, heureFin: e.target.value }))} /></div>
            <div className="col-span-2 space-y-2"><Label>Services</Label>
              <div className="flex flex-wrap gap-2">
                {services.map(s => (
                  <button key={s.id} type="button" onClick={() => setForm(f => ({ ...f, serviceIds: f.serviceIds.includes(s.id) ? f.serviceIds.filter(x => x !== s.id) : [...f.serviceIds, s.id] }))}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${form.serviceIds.includes(s.id) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-muted"}`}>
                    {s.nom}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2"><Label>Montant estimé</Label><Input type="number" min={0} value={form.montantEstime} onChange={(e) => setForm(f => ({ ...f, montantEstime: Number(e.target.value) }))} /></div>
            <div className="space-y-2"><Label>Statut</Label>
              <Select value={form.statut} onValueChange={(v: StatutRendezVous) => setForm(f => ({ ...f, statut: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="en_attente">En attente</SelectItem><SelectItem value="confirme">Confirmé</SelectItem><SelectItem value="annule">Annulé</SelectItem><SelectItem value="termine">Terminé</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={!form.clientId || !form.date || isPending}>{editId ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
