"use server";

import { revalidatePath } from "next/cache";
import { getDataContext } from "@/lib/auth/context";

export async function getAgents() {
  const ctx = await getDataContext();
  if (!ctx) return [];
  const { db, userId } = ctx;
  const { data } = await db.from("agents").select("*").eq("user_id", userId).eq("actif", true).order("nom");
  return data ?? [];
}

export async function createAgent(nom: string) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("agents").insert({ user_id: userId, nom });
  if (error) return { error: error.message };
  revalidatePath("/agents");
  return { success: true };
}

export async function updateAgent(id: string, nom: string) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("agents").update({ nom }).eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/agents");
  return { success: true };
}

export async function deleteAgent(id: string) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("agents").update({ actif: false }).eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/agents");
  return { success: true };
}
