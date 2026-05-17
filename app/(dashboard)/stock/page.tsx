import { createClient } from "@/lib/supabase/server";
import { StockClient } from "@/components/stock/StockClient";

export default async function StockPage() {
  const supabase = createClient();
  const [{ data: stock }, { data: articles }] = await Promise.all([
    supabase.from("stock").select("*").order("nom"),
    supabase.from("services").select("id, nom, stock_id").eq("type", "article").order("nom"),
  ]);
  return <StockClient initialStock={stock ?? []} articles={(articles ?? []) as { id: string; nom: string; stock_id: string | null }[]} />;
}
