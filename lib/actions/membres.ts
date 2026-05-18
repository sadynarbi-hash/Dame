"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getEffectivePlan, PLAN_LIMITS } from "@/lib/plan";
import type { Permissions } from "@/lib/auth/context";

function serviceKeyAvailable() {
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return k.length > 30 && !k.startsWith("REMPLACER");
}

async function checkOwner() {
  if (!serviceKeyAvailable()) throw new Error("Service role key non configurée");

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const db = createServiceRoleClient();
  // Verify this user is actually a salon owner (has their own entreprise)
  const { data: entreprise } = await db
    .from("entreprises")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!entreprise) throw new Error("Accès réservé au propriétaire du salon");

  return { userId: user.id, db };
}

export async function getMembres() {
  const { userId, db } = await checkOwner();
  const { data } = await db
    .from("membres_salon")
    .select("id, email, nom, role, permissions, actif, created_at, membre_user_id")
    .eq("owner_user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createMembre(data: {
  email: string; nom: string; role: string; permissions: Permissions;
}) {
  const { userId, db } = await checkOwner();

  // Vérification plan
  const { data: entreprise } = await db
    .from("entreprises")
    .select("abonnement_statut, abonnement_plan, trial_ends_at")
    .eq("user_id", userId)
    .single();
  const plan = getEffectivePlan(
    entreprise?.abonnement_statut ?? null,
    entreprise?.abonnement_plan ?? null,
    entreprise?.trial_ends_at ?? null
  );
  if (plan === "starter") {
    return { error: "La gestion des utilisateurs nécessite le plan Business (35 000 FCFA/mois)." };
  }
  const { count: countMembres } = await db
    .from("membres_salon")
    .select("*", { count: "exact", head: true })
    .eq("owner_user_id", userId)
    .eq("actif", true);
  if ((countMembres ?? 0) >= PLAN_LIMITS.business.membres_max) {
    return { error: `Limite atteinte : le plan Business permet jusqu'à ${PLAN_LIMITS.business.membres_max} utilisateurs.` };
  }

  const { data: existing } = await db
    .from("membres_salon")
    .select("id")
    .eq("owner_user_id", userId)
    .eq("email", data.email)
    .maybeSingle();
  if (existing) return { error: "Un utilisateur avec cet email existe déjà" };

  const { error } = await db.from("membres_salon").insert({
    owner_user_id: userId,
    email: data.email,
    nom: data.nom,
    role: data.role,
    permissions: data.permissions,
  });
  if (error) return { error: error.message };
  revalidatePath("/parametres/utilisateurs");
  return { success: true };
}

export async function updateMembre(id: string, data: {
  nom?: string; role?: string; permissions?: Permissions; actif?: boolean;
}) {
  const { userId, db } = await checkOwner();
  const { error } = await db
    .from("membres_salon")
    .update(data)
    .eq("id", id)
    .eq("owner_user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/parametres/utilisateurs");
  return { success: true };
}

export async function deleteMembre(id: string) {
  const { userId, db } = await checkOwner();
  const { error } = await db
    .from("membres_salon")
    .delete()
    .eq("id", id)
    .eq("owner_user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/parametres/utilisateurs");
  return { success: true };
}
