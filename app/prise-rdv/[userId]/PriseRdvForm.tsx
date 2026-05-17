"use client";

import { useState, useTransition } from "react";
import { creerRdvPublic } from "@/lib/actions/rdv-public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Calendar } from "lucide-react";

type Service = { id: string; nom: string; prix_ttc: number; categorie: string };

const HEURES = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00"];

function heureAjout(heure: string, minutes: number): string {
  const [h, m] = heure.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function PriseRdvForm({ userId, services }: { userId: string; services: Service[] }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    clientPrenom: "", clientNom: "", clientTelephone: "",
    date: "", heureDebut: "09:00", notes: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await creerRdvPublic(userId, {
        clientNom: form.clientNom,
        clientPrenom: form.clientPrenom,
        clientTelephone: form.clientTelephone,
        date: form.date,
        heureDebut: form.heureDebut,
        heureFin: heureAjout(form.heureDebut, 60),
        serviceIds: selectedServices,
        notes: form.notes,
      });
      if (result.error) setError(result.error);
      else setSuccess(true);
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold">Rendez-vous confirmé !</h2>
        <p className="text-muted-foreground max-w-sm">Votre demande a bien été enregistrée. Le salon vous contactera pour confirmer.</p>
      </div>
    );
  }

  const categories = Array.from(new Set(services.map(s => s.categorie)));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Coordonnées */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">Vos coordonnées</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input id="prenom" required value={form.clientPrenom} onChange={e => setForm(f => ({ ...f, clientPrenom: e.target.value }))} placeholder="Fatou" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="nom">Nom *</Label>
            <Input id="nom" required value={form.clientNom} onChange={e => setForm(f => ({ ...f, clientNom: e.target.value }))} placeholder="Diallo" />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label htmlFor="tel">Téléphone *</Label>
            <Input id="tel" required type="tel" value={form.clientTelephone} onChange={e => setForm(f => ({ ...f, clientTelephone: e.target.value }))} placeholder="77 000 00 00" />
          </div>
        </div>
      </div>

      {/* Date & heure */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold flex items-center gap-2"><Calendar className="h-4 w-4" />Date & heure</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="date">Date *</Label>
            <Input id="date" required type="date" min={new Date().toISOString().split("T")[0]} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="heure">Heure *</Label>
            <select
              id="heure"
              required
              value={form.heureDebut}
              onChange={e => setForm(f => ({ ...f, heureDebut: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {HEURES.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Services */}
      {services.length > 0 && (
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h3 className="font-semibold">Services souhaités</h3>
          {categories.map(cat => (
            <div key={cat}>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">{cat}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {services.filter(s => s.categorie === cat).map(s => (
                  <label key={s.id} className={`flex items-center justify-between gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${selectedServices.includes(s.id) ? "border-primary bg-primary/5" : "hover:bg-muted/40"}`}>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" checked={selectedServices.includes(s.id)} onChange={() => toggleService(s.id)} />
                      <span className="text-sm font-medium">{s.nom}</span>
                    </div>
                    <span className="text-sm text-muted-foreground shrink-0">{s.prix_ttc.toLocaleString("fr-FR")} FCFA</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      <div className="rounded-xl border bg-card p-5 space-y-2">
        <Label htmlFor="notes">Message / notes (facultatif)</Label>
        <Textarea id="notes" placeholder="Précisez votre demande..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      </div>

      {error && <p className="text-sm text-destructive rounded-lg bg-destructive/10 p-3">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? "Envoi en cours..." : "Confirmer ma demande"}
      </Button>
    </form>
  );
}
