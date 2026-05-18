"use client";

import { useTransition } from "react";
import { setStatutCompte, setPlanCompte } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Ban, Clock, Star } from "lucide-react";

type Compte = {
  id: string; user_id: string; nom: string; email: string;
  abonnement_statut: string | null; abonnement_plan: string | null;
  trial_ends_at: string | null; created_at: string;
};

function StatutBadge({ statut, trialEndsAt }: { statut: string | null; trialEndsAt: string | null }) {
  const expireDate = trialEndsAt ? new Date(trialEndsAt) : null;
  const estExpire = expireDate && expireDate < new Date();

  if (statut === "actif") return <Badge className="bg-green-100 text-green-700">Actif</Badge>;
  if (statut === "suspendu") return <Badge variant="destructive">Suspendu</Badge>;
  if (statut === "trial") {
    if (estExpire) return <Badge className="bg-red-100 text-red-700">Essai expiré</Badge>;
    return <Badge className="bg-blue-100 text-blue-700">Essai — expire le {expireDate?.toLocaleDateString("fr-FR")}</Badge>;
  }
  return <Badge variant="secondary">{statut ?? "—"}</Badge>;
}

function PlanBadge({ plan }: { plan: string | null }) {
  if (plan === "business") return <Badge className="bg-purple-100 text-purple-700 font-semibold">Business</Badge>;
  if (plan === "starter") return <Badge className="bg-blue-100 text-blue-700">Starter</Badge>;
  return <Badge className="bg-slate-100 text-slate-500">Gratuit</Badge>;
}

export function AdminComptesClient({ comptes }: { comptes: Compte[] }) {
  const [isPending, startTransition] = useTransition();

  const changeStatut = (userId: string, statut: "actif" | "suspendu" | "trial") => {
    if (!confirm(`Confirmer : passer ce compte en "${statut}" ?`)) return;
    startTransition(async () => { await setStatutCompte(userId, statut); });
  };

  const changePlan = (userId: string, plan: "gratuit" | "starter" | "business") => {
    if (!confirm(`Confirmer : passer ce compte au plan "${plan}" ?`)) return;
    startTransition(async () => { await setPlanCompte(userId, plan); });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin — Gestion des comptes</h1>
        <p className="text-muted-foreground text-sm">{comptes.length} compte(s) enregistré(s)</p>
      </div>

      <div className="rounded-xl border bg-white overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Salon</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plan</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Créé le</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Changer statut</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Changer plan</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {comptes.map((c) => (
              <tr key={c.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{c.nom}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3">
                  <StatutBadge statut={c.abonnement_statut} trialEndsAt={c.trial_ends_at} />
                </td>
                <td className="px-4 py-3">
                  <PlanBadge plan={c.abonnement_plan} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {c.abonnement_statut !== "actif" && (
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 h-7 text-xs" disabled={isPending}
                        onClick={() => changeStatut(c.user_id, "actif")}>
                        <CheckCircle className="h-3 w-3 mr-1" />Activer
                      </Button>
                    )}
                    {c.abonnement_statut !== "suspendu" && (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 h-7 text-xs" disabled={isPending}
                        onClick={() => changeStatut(c.user_id, "suspendu")}>
                        <Ban className="h-3 w-3 mr-1" />Suspendre
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-blue-600 h-7 text-xs" disabled={isPending}
                      onClick={() => changeStatut(c.user_id, "trial")}>
                      <Clock className="h-3 w-3 mr-1" />+14j essai
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {c.abonnement_plan !== "gratuit" && (
                      <Button size="sm" variant="outline" className="text-slate-500 border-slate-200 h-7 text-xs" disabled={isPending}
                        onClick={() => changePlan(c.user_id, "gratuit")}>
                        → Gratuit
                      </Button>
                    )}
                    {c.abonnement_plan !== "starter" && (
                      <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 h-7 text-xs" disabled={isPending}
                        onClick={() => changePlan(c.user_id, "starter")}>
                        → Starter
                      </Button>
                    )}
                    {c.abonnement_plan !== "business" && (
                      <Button size="sm" variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50 h-7 text-xs" disabled={isPending}
                        onClick={() => changePlan(c.user_id, "business")}>
                        <Star className="h-3 w-3 mr-1" />→ Business
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground space-y-1">
        <p className="font-medium text-foreground mb-2">Plans tarifaires</p>
        <p><span className="font-medium text-foreground">Starter — 25 000 FCFA/mois</span> : 100 factures/mois · 1 utilisateur · stock basique</p>
        <p><span className="font-medium text-foreground">Business — 35 000 FCFA/mois</span> : Factures illimitées · 5 utilisateurs · stock avancé + rapports bénéfices</p>
        <p><span className="font-medium text-foreground">Gratuit — 0 FCFA</span> : 5 factures/mois · 1 utilisateur</p>
        <p className="text-xs mt-2">Pendant l&apos;essai actif, les utilisateurs ont accès au plan Business.</p>
      </div>
    </div>
  );
}
