"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
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
