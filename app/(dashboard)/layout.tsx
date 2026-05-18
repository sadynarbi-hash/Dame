import { getDataContext } from "@/lib/auth/context";
import { LayoutClient } from "@/components/layout/LayoutClient";
import { ThemeWrapper } from "@/components/layout/ThemeWrapper";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getDataContext();
  if (!ctx) redirect("/landing");

  const { db, userId, isMembre, permissions } = ctx;

  const [{ data: entreprise }, { data: allStock }] = await Promise.all([
    db.from("entreprises").select("nom, couleur_principale, logo, abonnement_statut, abonnement_plan, trial_ends_at").eq("user_id", userId).single(),
    db.from("stock").select("quantite, seuil_alerte").eq("user_id", userId),
  ]);

  // Vérification abonnement (pour le propriétaire uniquement)
  if (entreprise && !isMembre) {
    const statut = entreprise.abonnement_statut;
    const plan = entreprise.abonnement_plan;
    const trialExpire = entreprise.trial_ends_at && new Date(entreprise.trial_ends_at) < new Date();
    // Plan gratuit = accès toujours autorisé (avec restrictions)
    const estGratuit = !plan || plan === "gratuit";
    const accesCoupe = statut === "suspendu" || (statut === "trial" && trialExpire && !estGratuit);
    if (accesCoupe) redirect("/abonnement-expire");
  }

  const alertesStock = (allStock ?? []).filter((a: { quantite: number; seuil_alerte: number }) => a.quantite <= a.seuil_alerte).length;
  const nomSalon = entreprise?.nom ?? "Mon Salon";
  const rawCouleur = entreprise?.couleur_principale ?? "#8B5CF6";
  const couleur = /^#[0-9A-Fa-f]{6}$/.test(rawCouleur) ? rawCouleur : "#8B5CF6";
  const logo = entreprise?.logo ?? null;

  return (
    <ThemeWrapper couleur={couleur}>
      <LayoutClient nomSalon={nomSalon} alertesStock={alertesStock} logo={logo} permissions={permissions}>
        {children}
      </LayoutClient>
    </ThemeWrapper>
  );
}
