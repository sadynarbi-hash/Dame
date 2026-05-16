import { createClient } from "@/lib/supabase/server";
import { ServicesClient } from "@/components/services/ServicesClient";

export default async function ServicesPage() {
  const supabase = createClient();
  const [{ data: services }, { data: stock }] = await Promise.all([
    supabase.from("services").select("*").order("nom"),
    supabase.from("stock").select("id, nom, quantite").order("nom"),
  ]);
  return <ServicesClient initialServices={services ?? []} stockItems={stock ?? []} />;
}
