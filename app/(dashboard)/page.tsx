import Link from "next/link";
import { FileText, Users, DollarSign, Clock, TrendingUp, Calendar, AlertTriangle, Plus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatutFactureBadge } from "@/components/shared/StatutBadge";
import { createClient } from "@/lib/supabase/server";
import { getStatsDashboard } from "@/lib/db/dashboard";
import { formatFCFA, formatDate } from "@/lib/utils/formatters";

export default async function DashboardPage() {
  const supabase = createClient();
  const [
    stats,
    { data: dernieresFactures },
    { data: stockAlertes },
  ] = await Promise.all([
    getStatsDashboard(),
    supabase.from("factures")
      .select("*, client:clients(prenom, nom)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("stock")
      .select("nom, quantite, unite, seuil_alerte")
      .lte("quantite", supabase.from("stock").select("seuil_alerte")),
  ]);

  // Workaround: filtre les alertes côté app
  const alertesStock = stockAlertes?.filter((a) => a.quantite <= a.seuil_alerte) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Bonjour ! Voici un résumé de votre activité.</p>
        <Button asChild>
          <Link href="/factures/nouvelle"><Plus className="h-4 w-4" />Nouvelle facture</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total factures" value={String(stats.totalFactures)} subtitle={`${formatFCFA(stats.montantTotal)} au total`} icon={FileText} color="purple" />
        <StatCard title="Montant encaissé" value={formatFCFA(stats.montantPaye)} subtitle="Factures payées" icon={DollarSign} color="green" trend={{ value: "ce mois", positive: true }} />
        <StatCard title="En attente" value={formatFCFA(stats.montantEnAttente)} subtitle="À encaisser" icon={Clock} color="yellow" />
        <StatCard title="En retard" value={formatFCFA(stats.montantEnRetard)} subtitle="À relancer" icon={TrendingUp} color="red" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Clients" value={String(stats.nbClients)} icon={Users} color="blue" subtitle="Clients actifs" />
        <StatCard title="RDV cette semaine" value={String(stats.nbRendezVousSemaine)} icon={Calendar} color="purple" />
        <StatCard title="Alertes stock" value={String(stats.alertesStock)} subtitle="À réapprovisionner" icon={AlertTriangle} color={stats.alertesStock > 0 ? "red" : "green"} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RevenueChart data={stats.evolutionMensuelle} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Dernières factures</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/factures">Voir tout</Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {(dernieresFactures ?? []).map((facture) => (
              <Link key={facture.id} href={`/factures/${facture.id}`}>
                <div className="flex items-center justify-between rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {facture.client ? `${(facture.client as { prenom: string; nom: string }).prenom} ${(facture.client as { prenom: string; nom: string }).nom}` : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">{facture.numero}</p>
                  </div>
                  <div className="text-right ml-2 shrink-0">
                    <p className="text-sm font-semibold">{formatFCFA(facture.total_ttc)}</p>
                    <StatutFactureBadge statut={facture.statut} />
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {alertesStock.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800 font-medium mb-3">
              <AlertTriangle className="h-4 w-4" />
              {alertesStock.length} article(s) à réapprovisionner
            </div>
            <div className="flex flex-wrap gap-2">
              {alertesStock.map((a, i) => (
                <span key={i} className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                  {a.nom} — {a.quantite} {a.unite}
                </span>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-3 border-orange-300 text-orange-800" asChild>
              <Link href="/stock">Gérer le stock</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
