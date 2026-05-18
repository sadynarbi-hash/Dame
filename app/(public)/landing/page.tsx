import Link from "next/link";
import {
  Scissors, FileText, Users, Calendar, Package,
  TrendingDown, BarChart3, CheckCircle, ArrowRight,
  Star, Shield, Globe, Sparkles, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "Facturation élégante",
    desc: "Créez des factures professionnelles avec TVA, envoyez-les et suivez chaque paiement. Numérotation automatique.",
  },
  {
    icon: Users,
    title: "Carnet de clientes",
    desc: "Historique des visites, montants dépensés, anniversaires — connaissez chaque cliente sur le bout des doigts.",
  },
  {
    icon: Calendar,
    title: "Agenda en ligne",
    desc: "Partagez votre lien de réservation. Vos clientes prennent rendez-vous 24h/24, vous recevez les demandes.",
  },
  {
    icon: Package,
    title: "Stock & produits",
    desc: "Alertes de réapprovisionnement automatiques. Plus jamais en rupture de vos produits capillaires préférés.",
  },
  {
    icon: TrendingDown,
    title: "Charges & salaires",
    desc: "Loyer, salaires, fournitures — analysez la rentabilité réelle de votre salon mois après mois.",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord",
    desc: "Revenus, factures en attente, alertes stock, rendez-vous du jour — votre salon en un seul regard.",
  },
];

const testimonials = [
  {
    name: "Aminata D.",
    salon: "Salon Beauté · Dakar",
    text: "Avant, je perdais des heures à rédiger mes factures. Maintenant c'est fait en 2 minutes. Mes clientes adorent la présentation professionnelle.",
  },
  {
    name: "Fatoumata K.",
    salon: "Espace Coiffure · Abidjan",
    text: "Le suivi du stock m'a sauvée plusieurs fois. Les alertes me préviennent avant que je sois en rupture de shampoing.",
  },
  {
    name: "Marième S.",
    salon: "Tresses & Beauté · Bamako",
    text: "Enfin un logiciel pensé pour les salons africains. Les montants en FCFA, les services adaptés à notre métier.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fdf8f5" }}>

      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100/60">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, #b5416a, #7c2048)" }}>
              <Scissors className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-stone-800 tracking-wide">Walima Techno</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/connexion">
              <Button variant="ghost" size="sm" className="text-stone-600 hover:text-stone-900">Se connecter</Button>
            </Link>
            <Link href="/connexion">
              <Button size="sm" className="text-white rounded-full px-5" style={{ background: "linear-gradient(135deg, #b5416a, #7c2048)" }}>
                Essai gratuit
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-16 overflow-hidden" style={{ background: "linear-gradient(160deg, #1a0a1e 0%, #4a1040 45%, #8B2255 100%)" }}>
        {/* Orbs décoratifs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ backgroundColor: "#d4547a" }} />
        <div className="absolute top-40 right-1/4 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ backgroundColor: "#f0a0c0" }} />

        <div className="relative mx-auto max-w-6xl px-5 pt-14">
          <div className="flex flex-col lg:flex-row items-center gap-10 pb-14">

            {/* Texte */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-white/8 px-4 py-1.5 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-rose-300" />
                <span className="text-rose-200 text-xs tracking-wide">Pour les salons de coiffure africains</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-white mb-5">
                Votre salon mérite<br />
                <span style={{ color: "#f9b8cc" }}>une gestion digne</span><br />
                <span className="text-white/80 font-light">de votre art.</span>
              </h1>

              <p className="text-rose-200/80 text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                Factures, clientes, rendez-vous, stock — tout centralisé. En FCFA, en français, pensé pour vous.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/connexion">
                  <Button size="lg" className="rounded-full px-8 font-semibold text-sm bg-white hover:bg-rose-50" style={{ color: "#7c2048" }}>
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/connexion">
                  <Button size="lg" variant="outline" className="rounded-full px-8 text-sm border-white/25 text-white/90 hover:bg-white/10">
                    Voir la démo
                  </Button>
                </Link>
              </div>

              <div className="mt-5 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {["A", "F", "M"].map((l) => (
                    <div key={l} className="w-7 h-7 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: "#8B2255" }}>{l}</div>
                  ))}
                </div>
                <p className="text-rose-300/80 text-xs">+500 salons nous font confiance</p>
              </div>
            </div>

            {/* Téléphone */}
            <div className="shrink-0 flex justify-center">
              <div className="relative" style={{ marginTop: "8px" }}>
                {/* Ombre portée rose */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-8 blur-2xl rounded-full" style={{ backgroundColor: "#b5416a", opacity: 0.45 }} />

                {/* Boutons latéraux gauche */}
                <div className="absolute rounded-l-sm" style={{ left: "-4px", top: "88px", width: "4px", height: "28px", backgroundColor: "#6b1a3a" }} />
                <div className="absolute rounded-l-sm" style={{ left: "-4px", top: "128px", width: "4px", height: "44px", backgroundColor: "#6b1a3a" }} />
                <div className="absolute rounded-l-sm" style={{ left: "-4px", top: "182px", width: "4px", height: "44px", backgroundColor: "#6b1a3a" }} />
                {/* Bouton droit */}
                <div className="absolute rounded-r-sm" style={{ right: "-4px", top: "118px", width: "4px", height: "60px", backgroundColor: "#6b1a3a" }} />

                {/* Cadre téléphone — couleur rose berry */}
                <div className="relative flex flex-col rounded-[42px] overflow-hidden"
                  style={{
                    width: "262px", height: "562px",
                    border: "10px solid #8B2255",
                    boxShadow: "0 40px 80px rgba(139,34,85,0.45), inset 0 0 0 1px rgba(255,200,220,0.15)",
                    backgroundColor: "#fdf8f5",
                  }}>

                  {/* Status bar */}
                  <div className="relative flex items-center justify-between shrink-0 px-5" style={{ height: "36px", backgroundColor: "#fdf8f5" }}>
                    <span className="font-bold text-[10px] text-stone-800">20:51</span>
                    {/* Dynamic island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full" style={{ width: "72px", height: "18px", backgroundColor: "#111" }} />
                    <div className="flex items-center gap-0.5 text-[9px] text-stone-700 font-medium">
                      <span>●●●</span><span className="ml-0.5">4G</span>
                      <span className="ml-0.5">🔋</span>
                    </div>
                  </div>

                  {/* Contenu scrollable */}
                  <div className="flex-1 overflow-hidden flex flex-col" style={{ backgroundColor: "#fdf8f5" }}>

                    {/* Carte hero revenus */}
                    <div className="mx-3 mt-1 rounded-2xl p-3.5 shrink-0" style={{ background: "linear-gradient(135deg, #b5416a 0%, #7c2048 100%)" }}>
                      <p className="text-[8px] text-rose-200/80 mb-0.5">Chiffre du mois</p>
                      <p className="text-[22px] font-bold text-white leading-none tracking-tight">1 250 000 F</p>
                      <div className="flex gap-2 mt-2.5">
                        <div className="flex-1 rounded-xl px-2 py-1.5" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                          <p className="text-[6.5px] text-rose-200/70">Clientes</p>
                          <p className="text-[11px] font-bold text-white">147</p>
                        </div>
                        <div className="flex-1 rounded-xl px-2 py-1.5" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                          <p className="text-[6.5px] text-rose-200/70">RDV ce mois</p>
                          <p className="text-[11px] font-bold text-white">38</p>
                        </div>
                        <div className="flex-1 rounded-xl px-2 py-1.5" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                          <p className="text-[6.5px] text-rose-200/70">En attente</p>
                          <p className="text-[11px] font-bold text-white">8</p>
                        </div>
                      </div>
                    </div>

                    {/* Barre recherche */}
                    <div className="mx-3 mt-2 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 shrink-0" style={{ backgroundColor: "#fff", border: "1px solid #f0d0da" }}>
                      <span className="text-[9px] text-stone-400">🔍</span>
                      <span className="text-[8px] text-stone-400">Rechercher une cliente...</span>
                    </div>

                    {/* Filtres */}
                    <div className="flex gap-1.5 mx-3 mt-1.5 shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-[7px] font-semibold text-white" style={{ backgroundColor: "#b5416a" }}>Toutes</span>
                      <span className="px-2.5 py-1 rounded-full text-[7px] text-stone-500" style={{ border: "1px solid #e5d0d6" }}>Payées</span>
                      <span className="px-2.5 py-1 rounded-full text-[7px] text-stone-500" style={{ border: "1px solid #e5d0d6" }}>En attente</span>
                    </div>

                    {/* Liste transactions */}
                    <div className="mx-3 mt-2 flex-1 overflow-hidden">
                      <p className="text-[6.5px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5">Factures récentes</p>
                      <div className="space-y-1.5">
                        {[
                          { initials: "AM", name: "Aminata M.", ref: "FAC-2026-0042", time: "14:32", amount: "45 000", paid: true },
                          { initials: "FK", name: "Fatou K.", ref: "FAC-2026-0041", time: "11:20", amount: "28 500", paid: false },
                          { initials: "MS", name: "Marième S.", ref: "FAC-2026-0040", time: "09:15", amount: "62 000", paid: true },
                          { initials: "KD", name: "Kadiatou D.", ref: "FAC-2026-0039", time: "Hier", amount: "35 000", paid: true },
                        ].map((item) => (
                          <div key={item.ref} className="flex items-center gap-2 rounded-xl px-2.5 py-2" style={{ backgroundColor: "#fff", border: "1px solid #f5e0e8" }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ background: "linear-gradient(135deg, #b5416a, #7c2048)" }}>
                              {item.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[8px] font-semibold text-stone-800 truncate">{item.name}</p>
                              <p className="text-[6.5px] text-stone-400">{item.ref} · {item.time}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[8.5px] font-bold text-stone-800">{item.amount} F</p>
                              <p className="text-[6px] font-medium" style={{ color: item.paid ? "#16803c" : "#b5416a" }}>{item.paid ? "Payée" : "En att."}</p>
                            </div>
                            <span className="text-[10px] text-stone-300 shrink-0">›</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Barre navigation bas */}
                  <div className="shrink-0 flex items-end justify-around pb-2 pt-1.5" style={{ backgroundColor: "#fff", borderTop: "1px solid #f5e0e8", height: "56px" }}>
                    {[
                      { emoji: "🏠", label: "Accueil", active: true },
                      { emoji: "👥", label: "Clientes", active: false },
                      { fab: true, label: "RDV" },
                      { emoji: "📄", label: "Factures", active: false },
                      { emoji: "⋯", label: "Autres", active: false },
                    ].map((item, i) =>
                      item.fab ? (
                        <div key={i} className="flex flex-col items-center" style={{ marginTop: "-18px" }}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg" style={{ background: "linear-gradient(135deg, #b5416a, #7c2048)" }}>+</div>
                          <span className="text-[6px] text-stone-400 mt-0.5">{item.label}</span>
                        </div>
                      ) : (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                          <span className="text-sm leading-none">{item.emoji}</span>
                          <span className="text-[6px]" style={{ color: item.active ? "#b5416a" : "#9ca3af" }}>{item.label}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="rounded-t-2xl border-t border-x border-white/10 bg-white/5 backdrop-blur px-6 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { value: "500+", label: "Salons actifs" },
                { value: "50 000+", label: "Factures créées" },
                { value: "98%", label: "Clientes satisfaites" },
                { value: "3 pays", label: "Sénégal · Côte d'Ivoire · Mali" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-semibold text-white">{s.value}</p>
                  <p className="text-[11px] text-rose-300/70 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-5" style={{ backgroundColor: "#fdf8f5" }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#b5416a" }}>Fonctionnalités</p>
            <h2 className="text-3xl font-semibold text-stone-900 tracking-tight">Tout ce dont votre salon a besoin</h2>
            <p className="text-stone-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
              Une suite complète d&apos;outils pensée pour les professionnelles de la beauté.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="group rounded-2xl bg-white border border-rose-100/60 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-4" style={{ backgroundColor: "#fff0f3" }}>
                  <f.icon className="h-5 w-5" style={{ color: "#b5416a" }} />
                </div>
                <h3 className="font-semibold text-stone-900 mb-2 text-sm">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section className="py-24 px-5" style={{ backgroundColor: "#1a0a1e" }}>
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#f9b8cc" }}>Démarrage rapide</p>
            <h2 className="text-3xl font-semibold text-white tracking-tight">Opérationnel en 5 minutes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Créez votre compte", desc: "Inscription gratuite en 30 secondes. Entrez le nom de votre salon et votre email." },
              { num: "02", title: "Configurez votre salon", desc: "Ajoutez vos services, vos tarifs et vos informations pour vos factures." },
              { num: "03", title: "Gérez votre activité", desc: "Créez factures et rendez-vous, suivez votre stock, analysez vos revenus." },
            ].map((s, i) => (
              <div key={s.num} className="text-center relative">
                {i < 2 && <div className="hidden sm:block absolute top-5 left-[calc(50%+28px)] right-0 h-px opacity-20" style={{ backgroundColor: "#f9b8cc" }} />}
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full font-bold text-white text-sm mb-4" style={{ background: "linear-gradient(135deg, #b5416a, #7c2048)" }}>{s.num}</div>
                <h3 className="font-semibold text-white mb-2 text-sm">{s.title}</h3>
                <p className="text-rose-300/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Témoignages ── */}
      <section className="py-24 px-5" style={{ backgroundColor: "#fff7f9" }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#b5416a" }}>Témoignages</p>
            <h2 className="text-3xl font-semibold text-stone-900 tracking-tight">Ce qu&apos;en disent nos clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white border border-rose-100 p-6" style={{ boxShadow: "0 4px 20px rgba(180,65,106,0.07)" }}>
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="border-t border-rose-50 pt-4">
                  <p className="font-semibold text-stone-900 text-sm">{t.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{t.salon}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tarifs ── */}
      <section className="py-24 px-5" style={{ backgroundColor: "#fdf8f5" }}>
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#b5416a" }}>Tarifs</p>
            <h2 className="text-3xl font-semibold text-stone-900 tracking-tight">Commencez gratuitement</h2>
            <p className="text-stone-500 mt-3 text-sm">Pas de surprise, pas d&apos;engagement.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-stone-200 bg-white p-8">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">Gratuit</p>
              <p className="text-4xl font-bold text-stone-900 mb-1">0 <span className="text-xl font-semibold text-stone-500">FCFA</span></p>
              <p className="text-xs text-stone-400 mb-6">Pour démarrer</p>
              <ul className="space-y-3 mb-8">
                {["Jusqu'à 20 factures/mois", "50 clientes", "Gestion stock basique", "Tableau de bord"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                    <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "#b5416a" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/connexion" className="block">
                <Button variant="outline" className="w-full rounded-xl border-stone-200">Commencer</Button>
              </Link>
            </div>

            <div className="rounded-2xl border-2 bg-white p-8 relative overflow-hidden" style={{ borderColor: "#b5416a" }}>
              <div className="absolute top-0 inset-x-0 h-1" style={{ background: "linear-gradient(90deg, #b5416a, #7c2048)" }} />
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#b5416a" }}>Pro</p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#fff0f3", color: "#b5416a" }}>Populaire</span>
              </div>
              <p className="text-4xl font-bold text-stone-900 mb-1">9 900 <span className="text-xl font-semibold text-stone-500">FCFA</span></p>
              <p className="text-xs text-stone-400 mb-6">par mois</p>
              <ul className="space-y-3 mb-8">
                {["Factures illimitées", "Clientes illimitées", "Rendez-vous en ligne", "Gestion charges & salaires", "Export PDF", "Support prioritaire"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                    <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "#b5416a" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/connexion" className="block">
                <Button className="w-full rounded-xl text-white" style={{ background: "linear-gradient(135deg, #b5416a, #7c2048)" }}>
                  Démarrer l&apos;essai gratuit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Confiance ── */}
      <section className="py-16 px-5 bg-white border-y border-rose-100/50">
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Shield, title: "Données sécurisées", desc: "Hébergement cloud chiffré, sauvegardes automatiques." },
            { icon: Globe, title: "Accessible partout", desc: "Téléphone, tablette ou ordinateur. Fonctionne partout." },
            { icon: Sparkles, title: "Mises à jour gratuites", desc: "Nouvelles fonctionnalités incluses sans frais." },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#fff0f3" }}>
                <item.icon className="h-5 w-5" style={{ color: "#b5416a" }} />
              </div>
              <p className="font-semibold text-stone-900 text-sm">{item.title}</p>
              <p className="text-stone-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-28 px-5 text-center" style={{ background: "linear-gradient(160deg, #1a0a1e 0%, #4a1040 50%, #8B2255 100%)" }}>
        <div className="mx-auto max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#f9b8cc" }}>Rejoignez-nous</p>
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-4">
            Votre salon mérite le meilleur.
          </h2>
          <p className="text-rose-200/70 text-base mb-10 leading-relaxed">
            Rejoignez plus de 500 salons qui font confiance à Walima Techno pour leur gestion quotidienne.
          </p>
          <Link href="/connexion">
            <Button size="lg" className="rounded-full px-10 font-semibold bg-white hover:bg-rose-50" style={{ color: "#7c2048" }}>
              Créer mon compte gratuit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-4 text-xs" style={{ color: "#f9b8cc88" }}>Installation en 2 minutes · Aucune carte requise</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-5" style={{ backgroundColor: "#0f0610" }}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #b5416a, #7c2048)" }}>
              <Scissors className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-white text-sm">Walima Techno</span>
          </div>
          <p className="text-stone-600 text-xs">© {new Date().getFullYear()} Walima Techno. Tous droits réservés.</p>
          <div className="flex gap-5 text-xs text-stone-500">
            <Link href="/connexion" className="hover:text-white transition-colors">Connexion</Link>
            <Link href="/connexion" className="hover:text-white transition-colors">S&apos;inscrire</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
