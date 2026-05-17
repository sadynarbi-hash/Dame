import { getSalonPublic } from "@/lib/actions/rdv-public";
import { PriseRdvForm } from "./PriseRdvForm";
import { notFound } from "next/navigation";

export default async function PriseRdvPage({ params }: { params: { userId: string } }) {
  const { entreprise, services } = await getSalonPublic(params.userId);

  if (!entreprise) notFound();

  const couleur = entreprise.couleur_principale ?? "#7c3aed";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header salon */}
      <div className="py-8 px-4" style={{ backgroundColor: couleur }}>
        <div className="max-w-lg mx-auto text-center text-white">
          {entreprise.logo && (
            <img src={entreprise.logo} alt={entreprise.nom} className="h-16 w-16 rounded-full object-cover mx-auto mb-3 border-2 border-white/40" />
          )}
          <h1 className="text-2xl font-bold">{entreprise.nom}</h1>
          {entreprise.adresse && <p className="text-sm opacity-80 mt-1">{entreprise.adresse}</p>}
          {entreprise.telephone && <p className="text-sm opacity-80">{entreprise.telephone}</p>}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6 text-center">Prendre un rendez-vous</h2>
        <PriseRdvForm userId={params.userId} services={services} />
      </div>
    </div>
  );
}
