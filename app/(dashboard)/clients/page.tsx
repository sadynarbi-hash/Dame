import { getDataContext } from "@/lib/auth/context";
import { ClientsClient } from "@/components/clients/ClientsClient";
import { redirect } from "next/navigation";

export default async function ClientsPage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const { data: clients } = await db.from("clients").select("*").eq("user_id", userId).order("nom");
  return <ClientsClient initialClients={clients ?? []} />;
}
