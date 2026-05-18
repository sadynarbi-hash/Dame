import { getDataContext } from "@/lib/auth/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFCFA, formatDate } from "@/lib/utils/formatters";
import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MouvementsFilter } from "@/components/stock/MouvementsFilter";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function MouvementsStockPage({ searchParams }: { searchParams: { from?: string; to?: string } }) {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const from = searchParams.from ?? "";
  const to = searchParams.to ?? "";

  let query = db.from("mouvements_stock").select("*, facture:factures(numero)").eq("user_id", userId).order("date", { ascending: false });
  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);

  const [{ data: mouvements }, { data: stockItems }] = await Promise.all([
    query,
    db.from("stock").select("id, prix_achat").eq("user_id", userId),
  ]);

  const mvts = mouvements ?? [];
  const prixAchatMap = new Map((stockItems ?? []).map((s: { id: string; prix_achat: number }) => [s.id, s.prix_achat]));

  const totalEntrees = mvts.filter((m: { type: string }) => m.type === "entree").reduce((s: number, m: { quantite: number; prix_unitaire: number }) => s + m.quantite * m.prix_unitaire, 0);
  const sorties = mvts.filter((m: { type: string }) => m.type === "sortie");
  const totalCA = sorties.reduce((s: number, m: { quantite: number; prix_unitaire: number }) => s + m.quantite * m.prix_unitaire, 0);
  const totalCoutSorties = sorties.reduce((s: number, m: { quantite: number; stock_id: string | null }) => {
    const pa = m.stock_id ? (prixAchatMap.get(m.stock_id) ?? 0) : 0;
    return s + m.quantite * pa;
  }, 0);
  const beneficeTotal = totalCA - totalCoutSorties;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Historique des entrées et sorties d&apos;articles</p>
        <Button variant="outline" size="sm" asChild><Link href="/stock">← Stock</Link></Button>
      </div>

      <Suspense>
        <MouvementsFilter from={from} to={to} />
      </Suspense>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <ArrowDownCircle className="h-8 w-8 text-green-600 shrink-0" />
            <div>
              <p className="text-xs text-green-700 font-medium">Total achats (entrées)</p>
              <p className="text-xl font-bold text-green-800">{formatFCFA(totalEntrees)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 flex items-center gap-3">
            <ArrowUpCircle className="h-8 w-8 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs text-blue-700 font-medium">CA articles vendus (sorties)</p>
              <p className="text-xl font-bold text-blue-800">{formatFCFA(totalCA)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={beneficeTotal >= 0 ? "border-purple-200 bg-purple-50" : "border-red-200 bg-red-50"}>
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className={`h-8 w-8 shrink-0 ${beneficeTotal >= 0 ? "text-purple-600" : "text-red-600"}`} />
            <div>
              <p className={`text-xs font-medium ${beneficeTotal >= 0 ? "text-purple-700" : "text-red-700"}`}>Bénéfice articles</p>
              <p className={`text-xl font-bold ${beneficeTotal >= 0 ? "text-purple-800" : "text-red-800"}`}>{formatFCFA(beneficeTotal)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Détail des mouvements{(from || to) && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {from && `du ${formatDate(from)}`}{from && to && " "}{to && `au ${formatDate(to)}`}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {mvts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">Aucun mouvement enregistré</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Article</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Qté</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Prix unitaire</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Montant</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Bénéfice</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Facture</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mvts.map((m: {
                    id: string; date: string; article_nom: string; type: string;
                    quantite: number; prix_unitaire: number; stock_id: string | null;
                    facture: { numero: string } | null;
                  }) => {
                    const isEntree = m.type === "entree";
                    const montant = m.quantite * m.prix_unitaire;
                    const prixAchat = m.stock_id ? (prixAchatMap.get(m.stock_id) ?? 0) : 0;
                    const benefice = isEntree ? null : (m.prix_unitaire - prixAchat) * m.quantite;
                    return (
                      <tr key={m.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(m.date)}</td>
                        <td className="px-4 py-3 font-medium">{m.article_nom}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${isEntree ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                            {isEntree ? <ArrowDownCircle className="h-3 w-3" /> : <ArrowUpCircle className="h-3 w-3" />}
                            {isEntree ? "Entrée" : "Sortie"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-semibold">{m.quantite}</td>
                        <td className="px-4 py-3 text-right">{formatFCFA(m.prix_unitaire)}</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatFCFA(montant)}</td>
                        <td className="px-4 py-3 text-right">
                          {benefice !== null ? (
                            <span className={`font-semibold ${benefice >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {benefice >= 0 ? "+" : ""}{formatFCFA(benefice)}
                            </span>
                          ) : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {m.facture ? m.facture.numero : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
