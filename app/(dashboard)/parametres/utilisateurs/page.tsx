import { getMembres } from "@/lib/actions/membres";
import { MembresClient } from "@/components/membres/MembresClient";
import { getDataContext } from "@/lib/auth/context";
import { redirect } from "next/navigation";

export default async function UtilisateursPage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  if (ctx.isMembre) redirect("/parametres");

  const membres = await getMembres();
  return <MembresClient initialMembres={membres as Parameters<typeof MembresClient>[0]["initialMembres"]} />;
}
