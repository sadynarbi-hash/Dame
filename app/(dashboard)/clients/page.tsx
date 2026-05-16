import { createClient } from "@/lib/supabase/server";
import { ClientsClient } from "@/components/clients/ClientsClient";

export default async function ClientsPage() {
  const supabase = createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("nom");
  const { count: nbFactures } = await supabase
    .from("factures")
    .select("client_id", { count: "exact", head: true });

  return <ClientsClient initialClients={clients ?? []} />;
}
