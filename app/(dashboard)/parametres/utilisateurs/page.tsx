import { getMembres } from "@/lib/actions/membres";
import { MembresClient } from "@/components/membres/MembresClient";
import { getDataContext } from "@/lib/auth/context";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

const SERVICE_KEY_OK = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").length > 30 &&
  !process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith("REMPLACER");

export default async function UtilisateursPage() {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");
  if (ctx.isMembre) redirect("/parametres");

  if (!SERVICE_KEY_OK) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Configuration requise</p>
          <p className="text-sm">Ajoutez la variable <code className="bg-muted px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> dans vos variables d&apos;environnement Vercel pour activer la gestion des utilisateurs.</p>
        </CardContent>
      </Card>
    );
  }

  const membres = await getMembres();
  return <MembresClient initialMembres={membres as Parameters<typeof MembresClient>[0]["initialMembres"]} />;
}
