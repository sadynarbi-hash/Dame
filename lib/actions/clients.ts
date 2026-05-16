"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createClient_(data: {
  nom: string; prenom: string; email?: string; telephone: string; adresse?: string; notes?: string; date_naissance?: string | null;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase.from("clients").insert({ ...data, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/clients");
  return { success: true };
}

export async function updateClient(id: string, data: Partial<{
  nom: string; prenom: string; email: string; telephone: string; adresse: string; notes: string; date_naissance: string | null;
}>) {
  const supabase = createClient();
  const { error } = await supabase.from("clients").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/clients");
  return { success: true };
}

export async function deleteClient(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/clients");
  return { success: true };
}
