import Link from "next/link";
import { FileText, Users, DollarSign, Clock, TrendingUp, Calendar, AlertTriangle, Plus, Trophy, Star } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatutFactureBadge } from "@/components/shared/StatutBadge";
import { getDataContext } from "@/lib/auth/context";
import { getStatsDashboard } from "@/lib/db/dashboard";
import { formatFCFA, formatDate } from "@/lib/utils/formatters";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const [stats, { data: dernieresFactures }, { data: stockAlertes }] = await Promise.all([
    getStatsDashboard(ctx),
    db.from("factures").select("*, client:clients(prenom, nom)").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
    db.from("stock").select("nom, quantite, unite, seuil_alerte").eq("user_id", userId),
  ]);

  const alertesStock = (stockAlertes ?? []).filter((a: { quantite: number; seuil_alerte: number }) => a.quantite <= a.seuil_alerte);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Bonjour ! Voici un résumé de votre activité.</p>
        <Button asChild>
          <Link href="/factures/nouvelle"><Plus className="h-4 w-4" />Nouvelle facture</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="CA Global" value={formatFCFA(stats.caGlobal)} subtitle={`${stats.totalFactures} factures émises`} icon={TrendingUp} color="purple" />
        <StatCard title="CA Encaissé" value={formatFCFA(stats.caEncaisse)} subtitle="Factures payées" icon={DollarSign} color="green" trend={{ value: "encaissé", positive: true }} />
        <StatCard title="CA Non recouvré" value={formatFCFA(stats.caNonRecouvre)} subtitle="En attente + en retard" icon={Clock} color="red" />
        <StatCard title="En retard" value={formatFCFA(stats.montantEnRetard)} subtitle="À relancer en priorité" icon={AlertTriangle} color="yellow" />
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
            {(dernieresFactures ?? []).map((facture: {
              id: string; numero: string; total_ttc: number; statut: import("@/types").StatutFacture;
              client: { prenom: string; nom: string } | null;
            }) => (
              <Link key={facture.id} href={`/factures/${facture.id}`}>
                <div className="flex items-center justify-between rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {facture.client ? `${facture.client.prenom} ${facture.client.nom}` : "—"}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-500" />CA par service</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/services">Voir tout</Link></Button>
          </CardHeader>
          <CardContent>
            {stats.topServices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Aucune vente enregistrée</p>
            ) : (
              <div className="space-y-3">
                {stats.topServices.map((s, i) => {
                  const maxCA = stats.topServices[0].totalCA;
                  const pct = Math.round((s.totalCA / maxCA) * 100);
                  return (
                    <div key={s.designation} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`font-bold text-xs w-5 shrink-0 ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-400" : "text-muted-foreground"}`}>#{i + 1}</span>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{s.designation}</p>
                            <p className="text-xs text-muted-foreground">{s.totalVendu} vendu(s)</p>
                          </div>
                        </div>
                        <span className="font-semibold text-primary shrink-0 ml-2">{formatFCFA(s.totalCA)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" />Meilleurs clients</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/clients">Voir tout</Link></Button>
          </CardHeader>
          <CardContent>
            {stats.topClients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Aucun client enregistré</p>
            ) : (
              <div className="space-y-3">
                {stats.topClients.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-muted text-muted-foreground"}`}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.prenom} {c.nom}</p>
                      <p className="text-xs text-muted-foreground">{c.nb_factures} facture(s)</p>
                    </div>
                    <span className="text-sm font-semibold text-primary shrink-0">{formatFCFA(c.total_depense)}</span>
                  </div>
                ))}
              </div>
            )}
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
              {alertesStock.map((a: { nom: string; quantite: number; unite: string }, i: number) => (
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
