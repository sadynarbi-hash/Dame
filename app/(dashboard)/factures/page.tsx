import { createClient } from "@/lib/supabase/server";
import { FacturesClient } from "@/components/factures/FacturesClient";

export default async function FacturesPage() {
  const supabase = createClient();
  const { data: factures } = await supabase
    .from("factures")
    .select("*, client:clients(id, nom, prenom)")
    .order("created_at", { ascending: false });

  return <FacturesClient initialFactures={factures ?? []} />;
}
