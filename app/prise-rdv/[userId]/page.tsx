import { getSalonPublic } from "@/lib/actions/rdv-public";
import { PriseRdvForm } from "./PriseRdvForm";
import { notFound } from "next/navigation";

function ProductPanel({ couleur }: { couleur: string }) {
  return (
    <div
      className="relative overflow-hidden h-full"
      style={{ background: `linear-gradient(180deg, ${couleur}18 0%, ${couleur}40 100%)` }}
    >
      <div className="absolute top-[5%]  left-[18%] w-28 h-36 rounded-3xl -rotate-6"  style={{ backgroundColor: `${couleur}35`, border: `2px solid ${couleur}70` }} />
      <div className="absolute top-[8%]  right-[12%] w-20 h-28 rounded-3xl  rotate-6"  style={{ backgroundColor: `${couleur}28`, border: `2px solid ${couleur}60` }} />
      <div className="absolute top-[34%] left-[28%] w-24 h-32 rounded-3xl  rotate-3"  style={{ backgroundColor: `${couleur}30`, border: `2px solid ${couleur}65` }} />
      <div className="absolute top-[38%] right-[16%] w-32 h-40 rounded-3xl -rotate-3"  style={{ backgroundColor: `${couleur}22`, border: `2px solid ${couleur}55` }} />
      <div className="absolute top-[64%] left-[10%] w-20 h-28 rounded-3xl  rotate-6"  style={{ backgroundColor: `${couleur}28`, border: `2px solid ${couleur}60` }} />
      <div className="absolute top-[66%] right-[18%] w-28 h-36 rounded-3xl -rotate-3"  style={{ backgroundColor: `${couleur}38`, border: `2px solid ${couleur}70` }} />
    </div>
  );
}

export default async function PriseRdvPage({ params }: { params: { userId: string } }) {
  const { entreprise, services } = await getSalonPublic(params.userId);
  if (!entreprise) notFound();

  const couleur = entreprise.couleur_principale ?? "#EC4899";

  const header = (
    <div className="text-center mb-6">
      {entreprise.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entreprise.logo}
          alt={entreprise.nom}
          className="h-20 w-20 rounded-full object-cover mx-auto mb-3 border-4 border-white/50 shadow-xl"
        />
      ) : (
        <div
          className="h-16 w-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white shadow-xl border-4 border-white/40"
          style={{ backgroundColor: `${couleur}cc` }}
        >
          {entreprise.nom.charAt(0).toUpperCase()}
        </div>
      )}
      <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide">{entreprise.nom}</h1>
      {entreprise.adresse && <p className="text-sm text-white/80 mt-1">{entreprise.adresse}</p>}
      {entreprise.telephone && <p className="text-sm text-white/80">{entreprise.telephone}</p>}
    </div>
  );

  const card = (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
      <h2 className="text-xl font-bold text-center mb-6">Prendre un rendez-vous</h2>
      <PriseRdvForm userId={params.userId} services={services} couleur={couleur} />
    </div>
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: `linear-gradient(135deg, ${couleur}18 0%, ${couleur}45 50%, ${couleur}18 100%)` }}
    >
      {/* Desktop 3-column */}
      <div
        className="hidden lg:grid min-h-screen"
        style={{ gridTemplateColumns: "1fr 520px 1fr" }}
      >
        <ProductPanel couleur={couleur} />
        <div className="flex flex-col justify-center py-10 px-6 overflow-y-auto">
          {header}
          {card}
        </div>
        <ProductPanel couleur={couleur} />
      </div>

      {/* Mobile */}
      <div className="lg:hidden min-h-screen flex flex-col items-center py-8 px-4 pb-16">
        {header}
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-center mb-6">Prendre un rendez-vous</h2>
          <PriseRdvForm userId={params.userId} services={services} couleur={couleur} />
        </div>
      </div>
    </div>
  );
}
