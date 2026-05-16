import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ThemeWrapper } from "@/components/layout/ThemeWrapper";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: entreprise } = await supabase.from("entreprises").select("nom, couleur_principale, logo").single();
  const { data: allStock } = await supabase.from("stock").select("*");

  const alertesStock = (allStock ?? []).filter((a) => a.quantite <= a.seuil_alerte).length;
  const nomSalon = entreprise?.nom ?? "Mon Salon";
  const couleur = entreprise?.couleur_principale ?? "#8B5CF6";
  const logo = entreprise?.logo ?? null;

  return (
    <ThemeWrapper couleur={couleur}>
      <Sidebar nomSalon={nomSalon} alertesStock={alertesStock} logo={logo} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header alertesStock={alertesStock} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </ThemeWrapper>
  );
}
