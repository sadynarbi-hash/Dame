"use client";

import { useState, useTransition } from "react";
import { creerRdvPublic } from "@/lib/actions/rdv-public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Calendar, User, Phone } from "lucide-react";

type Service = { id: string; nom: string; prix_ttc: number; categorie: string };

const HEURES = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00","17:30","18:00",
];

function heureAjout(heure: string, minutes: number): string {
  const [h, m] = heure.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function PriseRdvForm({
  userId,
  services,
  couleur = "#EC4899",
}: {
  userId: string;
  services: Service[];
  couleur?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    clientPrenom: "", clientNom: "", clientTelephone: "",
    date: "", heureDebut: "09:00", notes: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (id: string) =>
    setSelectedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

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
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold">Rendez-vous confirmé !</h2>
        <p className="text-muted-foreground max-w-sm">
          Votre demande a bien été enregistrée. Le salon vous contactera pour confirmer.
        </p>
      </div>
    );
  }

  const categories = Array.from(new Set(services.map(s => s.categorie)));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Coordonnées */}
      <div className="space-y-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <User className="h-3.5 w-3.5" /> Vos coordonnées
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="prenom" className="text-xs">Prénom *</Label>
            <Input id="prenom" required placeholder="Fatou" value={form.clientPrenom} onChange={e => setForm(f => ({ ...f, clientPrenom: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="nom" className="text-xs">Nom *</Label>
            <Input id="nom" required placeholder="Diallo" value={form.clientNom} onChange={e => setForm(f => ({ ...f, clientNom: e.target.value }))} />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="tel" className="text-xs flex items-center gap-1">
            <Phone className="h-3 w-3" /> Téléphone *
          </Label>
          <Input id="tel" required type="tel" placeholder="77 000 00 00" value={form.clientTelephone} onChange={e => setForm(f => ({ ...f, clientTelephone: e.target.value }))} />
        </div>
      </div>

      <hr className="border-black/8" />

      {/* Date & heure */}
      <div className="space-y-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" /> Date & heure
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="date" className="text-xs">Date *</Label>
            <Input
              id="date" required type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="heure" className="text-xs">Heure *</Label>
            <select
              id="heure" required value={form.heureDebut}
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
        <>
          <hr className="border-black/8" />
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Services souhaités</p>
            {categories.map(cat => (
              <div key={cat}>
                <p className="text-[11px] font-semibold uppercase text-muted-foreground/60 mb-2">{cat}</p>
                <div className="space-y-1.5">
                  {services.filter(s => s.categorie === cat).map(s => {
                    const checked = selectedServices.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className="flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all"
                        style={checked
                          ? { borderColor: couleur, backgroundColor: `${couleur}12`, borderWidth: "2px" }
                          : { borderColor: "rgba(0,0,0,0.08)" }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleService(s.id)}
                          className="rounded"
                          style={{ accentColor: couleur }}
                        />
                        <span className="text-sm font-medium">{s.nom}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Notes */}
      <div className="space-y-1">
        <Label htmlFor="notes" className="text-xs text-muted-foreground">Message (facultatif)</Label>
        <Textarea
          id="notes" placeholder="Précisez votre demande..."
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          rows={2}
        />
      </div>

      {error && <p className="text-sm text-red-600 rounded-xl bg-red-50 px-4 py-3">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-12 rounded-xl text-white font-semibold text-base transition-opacity disabled:opacity-60"
        style={{ backgroundColor: couleur }}
      >
        {isPending ? "Envoi en cours..." : "Valider ma demande"}
      </button>
    </form>
  );
}
