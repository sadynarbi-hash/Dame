"use server";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

async function checkAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) throw new Error("Non autorisé");
}

export async function getComptes() {
  await checkAdmin();
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("entreprises")
    .select("id, user_id, nom, email, abonnement_statut, abonnement_plan, trial_ends_at, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function setStatutCompte(userId: string, statut: "actif" | "suspendu" | "trial") {
  await checkAdmin();
  const supabase = createServiceRoleClient();
  const update: Record<string, unknown> = { abonnement_statut: statut };
  if (statut === "trial") update.trial_ends_at = new Date(Date.now() + 14 * 86400000).toISOString();
  if (statut === "actif") update.trial_ends_at = null;
  await supabase.from("entreprises").update(update).eq("user_id", userId);
  revalidatePath("/admin/comptes");
}

export async function setPlanCompte(userId: string, plan: "starter" | "business") {
  await checkAdmin();
  const supabase = createServiceRoleClient();
  await supabase.from("entreprises").update({ abonnement_plan: plan }).eq("user_id", userId);
  revalidatePath("/admin/comptes");
}
