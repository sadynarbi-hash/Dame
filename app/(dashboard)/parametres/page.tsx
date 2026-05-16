import { createClient } from "@/lib/supabase/server";
import { ParametresClient } from "@/components/parametres/ParametresClient";

export default async function ParametresPage() {
  const supabase = createClient();
  const { data: entreprise } = await supabase.from("entreprises").select("*").single();
  return <ParametresClient initialEntreprise={entreprise} />;
}
