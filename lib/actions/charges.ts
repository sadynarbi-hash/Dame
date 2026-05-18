"use server";

import { revalidatePath } from "next/cache";
import { getDataContext } from "@/lib/auth/context";
import type { TypeCharge } from "@/types";

export async function createCharge(data: {
  libelle: string; type: TypeCharge; montant: number; mois: number; annee: number;
  description?: string; employe?: string;
}) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("charges").insert({ ...data, user_id: userId });
  if (error) return { error: error.message };
  revalidatePath("/charges");
  return { success: true };
}

export async function updateCharge(id: string, data: Partial<{
  libelle: string; type: TypeCharge; montant: number; mois: number; annee: number;
  description: string; employe: string;
}>) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("charges").update(data).eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/charges");
  return { success: true };
}

export async function deleteCharge(id: string) {
  const ctx = await getDataContext();
  if (!ctx) return { error: "Non authentifié" };
  const { db, userId } = ctx;

  const { error } = await db.from("charges").delete().eq("id", id).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/charges");
  return { success: true };
}
