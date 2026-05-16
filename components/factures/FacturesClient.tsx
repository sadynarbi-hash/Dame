"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatutFactureBadge } from "@/components/shared/StatutBadge";
import { updateStatutFacture } from "@/lib/actions/factures";
import { formatFCFA, formatDate } from "@/lib/utils/formatters";
import type { StatutFacture } from "@/types";

type FactureRow = {
  id: string; numero: string; statut: StatutFacture;
  date_emission: string; date_echeance: string; total_ttc: number;
  client: { id: string; nom: string; prenom: string } | null;
};

const STATUTS: { value: StatutFacture | "tous"; label: string }[] = [
  { value: "tous", label: "Toutes" },
  { value: "brouillon", label: "Brouillon" },
  { value: "envoyee", label: "Envoyées" },
  { value: "payee", label: "Payées" },
  { value: "en_retard", label: "En retard" },
];

export function FacturesClient({ initialFactures }: { initialFactures: FactureRow[] }) {
  const [factures, setFactures] = useState(initialFactures);
  const [search, setSearch] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<StatutFacture | "tous">("tous");
  const [isPending, startTransition] = useTransition();

  const filtered = factures.filter((f) => {
    const nomClient = f.client ? `${f.client.prenom} ${f.client.nom}`.toLowerCase() : "";
    const matchSearch = f.numero.toLowerCase().includes(search.toLowerCase()) || nomClient.includes(search.toLowerCase());
    const matchStatut = filtreStatut === "tous" || f.statut === filtreStatut;
    return matchSearch && matchStatut;
  });

  const handleMarquerPayee = (id: string) => {
    startTransition(async () => {
      await updateStatutFacture(id, "payee");
      setFactures((prev) => prev.map((f) => f.id === id ? { ...f, statut: "payee" as StatutFacture } : f));
    });
  };

  const totalFiltre = filtered.reduce((s, f) => s + f.total_ttc, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button asChild><Link href="/factures/nouvelle"><Plus className="h-4 w-4" />Nouvelle facture</Link></Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUTS.map(({ value, label }) => (
          <button key={value} onClick={() => setFiltreStatut(value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filtreStatut === value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
            {label}
            <span className="ml-1.5 text-xs opacity-70">
              ({value === "tous" ? factures.length : factures.filter(f => f.statut === value).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} facture(s) — Total : <span className="font-semibold text-foreground">{formatFCFA(totalFiltre)}</span>
        </p>
      )}

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">Aucune facture trouvée</p>
            <Button className="mt-4" asChild><Link href="/factures/nouvelle">Créer une facture</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Numéro</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Échéance</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Montant TTC</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/factures/${f.id}`} className="font-mono font-medium text-primary hover:underline">{f.numero}</Link>
                  </td>
                  <td className="px-4 py-3 font-medium">{f.client ? `${f.client.prenom} ${f.client.nom}` : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(f.date_emission)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(f.date_echeance)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatFCFA(f.total_ttc)}</td>
                  <td className="px-4 py-3 text-center"><StatutFactureBadge statut={f.statut} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" asChild><Link href={`/factures/${f.id}`}>Voir</Link></Button>
                      {f.statut !== "payee" && (
                        <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50" disabled={isPending} onClick={() => handleMarquerPayee(f.id)}>
                          Marquer payée
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
