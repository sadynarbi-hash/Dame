"use server";

import { revalidatePath } from "next/cache";
import { getDataContext } from "@/lib/auth/context";

export async function createClient_(data: {
  nom: string; prenom: string; email?: string; telephone: string; adresse?: string; notes?: string; date_naissance?: string | null;
}) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("clients").insert({ ...data, user_id: userId });
  if (error) return { error: error.message };
  revalidatePath("/clients");
  return { success: true };
}

export async function updateClient(id: string, data: Partial<{
  nom: string; prenom: string; email: string; telephone: string; adresse: string; notes: string; date_naissance: string | null;
}>) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("clients").update(data).eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/clients");
  return { success: true };
}

export async function deleteClient(id: string) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("clients").delete().eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/clients");
  return { success: true };
}
