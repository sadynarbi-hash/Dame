"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getAgents() {
  const supabase = createClient();
  const { data } = await supabase.from("agents").select("*").eq("actif", true).order("nom");
  return data ?? [];
}

export async function createAgent(nom: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };
  const { error } = await supabase.from("agents").insert({ user_id: user.id, nom });
  if (error) return { error: error.message };
  revalidatePath("/agents");
  return { success: true };
}

export async function updateAgent(id: string, nom: string) {
  const supabase = createClient();
  const { error } = await supabase.from("agents").update({ nom }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/agents");
  return { success: true };
}

export async function deleteAgent(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("agents").update({ actif: false }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/agents");
  return { success: true };
}
