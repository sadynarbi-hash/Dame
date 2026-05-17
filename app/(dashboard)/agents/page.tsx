import { createClient } from "@/lib/supabase/server";
import { AgentsClient } from "@/components/agents/AgentsClient";

export default async function AgentsPage() {
  const supabase = createClient();
  const { data: agents } = await supabase.from("agents").select("*").eq("actif", true).order("nom");
  return <AgentsClient initialAgents={agents ?? []} />;
}
