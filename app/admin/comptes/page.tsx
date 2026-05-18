import { createClient } from "@/lib/supabase/server";
import { getComptes } from "@/lib/actions/admin";
import { AdminComptesClient } from "./AdminComptesClient";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = "sadynarbi@gmail.com";

export default async function AdminComptesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) redirect("/");

  const comptes = await getComptes();
  return <AdminComptesClient comptes={comptes} />;
}
