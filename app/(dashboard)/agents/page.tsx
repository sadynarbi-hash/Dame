import { getDataContext } from "@/lib/auth/context";
import { AgentsClient } from "@/components/agents/AgentsClient";
import { redirect } from "next/navigation";

export default async function AgentsPage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const { data: agents } = await db.from("agents").select("*").eq("user_id", userId).eq("actif", true).order("nom");
  return <AgentsClient initialAgents={agents ?? []} />;
}
