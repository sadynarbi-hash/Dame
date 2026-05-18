import { getDataContext } from "@/lib/auth/context";
import { ChargesClient } from "@/components/charges/ChargesClient";
import { redirect } from "next/navigation";

export default async function ChargesPage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  const { db, userId } = ctx;

  const { data: charges } = await db.from("charges").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  return <ChargesClient initialCharges={charges ?? []} />;
}
