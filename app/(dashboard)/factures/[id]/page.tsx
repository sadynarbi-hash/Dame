import { notFound, redirect } from "next/navigation";
import { getDataContext } from "@/lib/auth/context";
import { FactureDetail } from "@/components/factures/FactureDetail";

export default async function FactureDetailPage({ params }: { params: { id: string } }) {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const [{ data: facture }, { data: entreprise }] = await Promise.all([
    db.from("factures")
      .select("*, client:clients(*), lignes:lignes_facture(*, agent:agents(nom))")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single(),
    db.from("entreprises").select("*").eq("user_id", userId).single(),
  ]);

  if (!facture) notFound();

  return <FactureDetail facture={facture} entreprise={entreprise} />;
}
