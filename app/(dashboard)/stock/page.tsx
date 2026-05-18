import { getDataContext } from "@/lib/auth/context";
import { StockClient } from "@/components/stock/StockClient";
import { redirect } from "next/navigation";

export default async function StockPage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const [{ data: stock }, { data: articles }] = await Promise.all([
    db.from("stock").select("*").eq("user_id", userId).order("nom"),
    db.from("services").select("id, nom, stock_id").eq("user_id", userId).eq("type", "article").order("nom"),
  ]);
  return <StockClient initialStock={stock ?? []} articles={(articles ?? []) as { id: string; nom: string; stock_id: string | null }[]} />;
}
