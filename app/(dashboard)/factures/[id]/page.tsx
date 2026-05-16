import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FactureDetail } from "@/components/factures/FactureDetail";

export default async function FactureDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: facture }, { data: entreprise }] = await Promise.all([
    supabase.from("factures")
      .select("*, client:clients(*), lignes:lignes_facture(*)")
      .eq("id", params.id)
      .single(),
    supabase.from("entreprises").select("*").single(),
  ]);

  if (!facture) notFound();

  return <FactureDetail facture={facture} entreprise={entreprise} />;
}
