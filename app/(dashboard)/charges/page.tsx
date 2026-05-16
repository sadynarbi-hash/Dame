import { createClient } from "@/lib/supabase/server";
import { ChargesClient } from "@/components/charges/ChargesClient";

export default async function ChargesPage() {
  const supabase = createClient();
  const { data: charges } = await supabase.from("charges").select("*").order("created_at", { ascending: false });
  return <ChargesClient initialCharges={charges ?? []} />;
}
