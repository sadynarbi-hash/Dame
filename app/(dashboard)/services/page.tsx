import { getDataContext } from "@/lib/auth/context";
import { ServicesClient } from "@/components/services/ServicesClient";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const [{ data: services }, { data: stock }] = await Promise.all([
    db.from("services").select("*").eq("user_id", userId).order("nom"),
    db.from("stock").select("id, nom, quantite").eq("user_id", userId).order("nom"),
  ]);
  return <ServicesClient initialServices={services ?? []} stockItems={stock ?? []} />;
}
