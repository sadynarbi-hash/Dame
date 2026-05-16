import { createClient } from "@/lib/supabase/server";
import { StockClient } from "@/components/stock/StockClient";

export default async function StockPage() {
  const supabase = createClient();
  const { data: stock } = await supabase.from("stock").select("*").order("nom");
  return <StockClient initialStock={stock ?? []} />;
}
