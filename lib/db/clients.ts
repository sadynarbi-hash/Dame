import { createClient } from "@/lib/supabase/server";

export async function getClients() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("nom");
  if (error) throw error;
  return data;
}

export async function getClientById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
