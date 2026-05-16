"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TypeCharge } from "@/types";

export async function createCharge(data: {
  libelle: string; type: TypeCharge; montant: number; mois: number; annee: number;
  description?: string; employe?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase.from("charges").insert({ ...data, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/charges");
  return { success: true };
}

export async function updateCharge(id: string, data: Partial<{
  libelle: string; type: TypeCharge; montant: number; mois: number; annee: number;
  description: string; employe: string;
}>) {
  const supabase = createClient();
  const { error } = await supabase.from("charges").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/charges");
  return { success: true };
}

export async function deleteCharge(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("charges").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/charges");
  return { success: true };
}
