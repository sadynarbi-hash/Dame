import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Permissions = {
  dashboard: boolean;
  factures: boolean;
  clients: boolean;
  services: boolean;
  stock: boolean;
  charges: boolean;
  rendez_vous: boolean;
  agents: boolean;
  parametres: boolean;
};

export type DataContext = {
  userId: string;
  isMembre: boolean;
  permissions: Permissions | null;
  db: SupabaseClient;
};

export const DEFAULT_PERMISSIONS: Permissions = {
  dashboard: true,
  factures: true,
  clients: true,
  services: false,
  stock: false,
  charges: false,
  rendez_vous: true,
  agents: false,
  parametres: false,
};

export async function getDataContext(): Promise<DataContext | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = createServiceRoleClient();

  // 1. Check if already UUID-linked as a member (fast path for existing members)
  const { data: membreByUuid } = await db
    .from("membres_salon")
    .select("owner_user_id, permissions")
    .eq("membre_user_id", user.id)
    .eq("actif", true)
    .maybeSingle();

  if (membreByUuid) {
    return {
      userId: membreByUuid.owner_user_id as string,
      isMembre: true,
      permissions: (membreByUuid.permissions as Permissions) ?? DEFAULT_PERMISSIONS,
      db,
    };
  }

  // 2. Auto-link by email for first-time member login
  //    Safety: owner_user_id must differ from user.id (can't be member of own salon)
  const { data: membreByEmail } = await db
    .from("membres_salon")
    .select("id, owner_user_id, permissions")
    .eq("email", user.email ?? "")
    .eq("actif", true)
    .is("membre_user_id", null)
    .maybeSingle();

  if (membreByEmail && (membreByEmail.owner_user_id as string) !== user.id) {
    await db.from("membres_salon").update({ membre_user_id: user.id }).eq("id", membreByEmail.id);
    return {
      userId: membreByEmail.owner_user_id as string,
      isMembre: true,
      permissions: (membreByEmail.permissions as Permissions) ?? DEFAULT_PERMISSIONS,
      db,
    };
  }

  // 3. Regular salon owner
  return {
    userId: user.id,
    isMembre: false,
    permissions: null,
    db,
  };
}
