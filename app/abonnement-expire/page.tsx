import { createClient } from "@/lib/supabase/server";
import { Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AbonnementExpirePage() {
  const supabase = createClient();
  const { data: entreprise } = await supabase.from("entreprises").select("nom, trial_ends_at, abonnement_statut").single();

  const isSuspendu = entreprise?.abonnement_statut === "suspendu";
  const whatsappMsg = encodeURIComponent(
    `Bonjour, je souhaite activer mon abonnement Walima Techno pour le salon "${entreprise?.nom ?? ""}". Merci.`
  );

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
            <Lock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {isSuspendu ? "Compte suspendu" : "Période d'essai terminée"}
          </h1>
          <p className="text-muted-foreground">
            {isSuspendu
              ? "Votre compte a été suspendu. Contactez-nous pour régulariser votre abonnement."
              : "Votre essai gratuit de 14 jours est terminé. Souscrivez un abonnement pour continuer à utiliser Walima Techno."}
          </p>
        </div>

        <div className="rounded-xl border bg-muted/30 p-4 text-sm space-y-1">
          <p className="font-semibold">Abonnement mensuel</p>
          <p className="text-2xl font-bold text-primary">9 900 FCFA <span className="text-sm font-normal text-muted-foreground">/ mois</span></p>
          <p className="text-muted-foreground text-xs">Accès illimité à toutes les fonctionnalités</p>
        </div>

        <div className="space-y-3">
          <a
            href={`https://wa.me/221${process.env.NEXT_PUBLIC_ADMIN_PHONE ?? ""}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white">
              <MessageCircle className="h-4 w-4" />
              Souscrire via WhatsApp
            </Button>
          </a>
          <Link href="/connexion">
            <Button variant="ghost" className="w-full text-sm text-muted-foreground">
              Se connecter avec un autre compte
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
