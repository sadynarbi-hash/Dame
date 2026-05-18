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
            <div className="shrink-0 flex justify-center pb-0">
              <div className="relative mt-2">
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-6 blur-2xl rounded-full opacity-60" style={{ backgroundColor: "#d4547a" }} />

                {/* Cadre téléphone */}
                <div className="relative w-[248px] h-[510px] rounded-[42px] border-[9px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden" style={{ backgroundColor: "#111", borderColor: "#1e1e1e" }}>
                  {/* Status */}
                  <div className="relative h-7 flex items-center justify-between px-4" style={{ backgroundColor: "#1c1917" }}>
                    <span className="text-white text-[9px] font-semibold">9:41</span>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 rounded-b-2xl" style={{ backgroundColor: "#111" }} />
                    <span className="text-white/40 text-[8px]">WiFi ●●●</span>
                  </div>

                  {/* App */}
                  <div className="flex" style={{ height: "calc(100% - 28px)" }}>
                    {/* Sidebar */}
                    <div className="w-[62px] flex flex-col pt-2 pb-4 shrink-0" style={{ backgroundColor: "#1e1419" }}>
                      <div className="flex justify-center mb-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #b5416a, #7c2048)" }}>
                          <Scissors className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      {[
                        { icon: BarChart3, label: "Accueil", active: true },
                        { icon: FileText, label: "Factures" },
                        { icon: Users, label: "Clientes" },
                        { icon: Scissors, label: "Services" },
                        { icon: Package, label: "Stock" },
                        { icon: Calendar, label: "RDV" },
                        { icon: TrendingDown, label: "Charges" },
                      ].map(({ icon: Icon, label, active }) => (
                        <div key={label} className="mx-1 mb-0.5 px-1 py-1.5 rounded-xl flex flex-col items-center gap-0.5" style={active ? { background: "linear-gradient(135deg, #b5416a55, #7c204866)" } : {}}>
                          <Icon className="h-3 w-3" style={{ color: active ? "#f9b8cc" : "#ffffff44" }} />
                          <span className="text-[6px] text-center leading-tight" style={{ color: active ? "#f9b8cc" : "#ffffff30" }}>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 p-2.5 overflow-hidden" style={{ backgroundColor: "#fdf8f5" }}>
                      <p className="text-[8.5px] font-bold text-stone-800 mb-1.5">Tableau de bord</p>
                      <div className="grid grid-cols-2 gap-1 mb-2">
                        {[
                          { label: "Revenus", value: "1,2M FCFA", bg: "#fff0f3", color: "#b5416a" },
                          { label: "Clientes", value: "147", bg: "#fef3e8", color: "#c47a1a" },
                          { label: "Factures", value: "8 att.", bg: "#fefce8", color: "#a37c0a" },
                          { label: "RDV auj.", value: "5", bg: "#f0fdf4", color: "#16803c" },
                        ].map((s) => (
                          <div key={s.label} className="rounded-xl p-1.5" style={{ backgroundColor: s.bg }}>
                            <p className="text-[5.5px] text-stone-400 mb-0.5">{s.label}</p>
                            <p className="text-[8px] font-bold" style={{ color: s.color }}>{s.value}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[6px] font-semibold uppercase tracking-wide text-stone-400 mb-1">Récentes</p>
                      {[
                        { client: "Aminata D.", montant: "45 000", paid: true },
                        { client: "Fatou K.", montant: "28 500", paid: false },
                        { client: "Marième S.", montant: "62 000", paid: true },
                      ].map((f) => (
                        <div key={f.client} className="flex items-center justify-between bg-white rounded-lg px-1.5 py-1 mb-0.5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                          <span className="text-[6.5px] text-stone-700">{f.client}</span>
                          <span className="text-[6.5px] font-bold text-stone-800">{f.montant}</span>
                          <span className="text-[5.5px] px-1 py-px rounded-full" style={f.paid ? { backgroundColor: "#dcfce7", color: "#16803c" } : { backgroundColor: "#fff0f3", color: "#b5416a" }}>
                            {f.paid ? "Payée" : "Att."}
                          </span>
                        </div>
                      ))}
                      <div className="mt-1.5 rounded-lg px-1.5 py-1 flex items-center gap-1 border" style={{ backgroundColor: "#fff8f0", borderColor: "#fde5c0" }}>
                        <Clock className="h-2 w-2 text-amber-600 shrink-0" />
                        <span className="text-[6px] text-amber-700">RDV demain — Kadiatou 10h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges flottants */}
                <div className="absolute -right-8 top-12 bg-white rounded-2xl px-3 py-2 flex items-center gap-2 border border-rose-100" style={{ boxShadow: "0 8px 24px rgba(180,65,106,0.15)" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px]" style={{ backgroundColor: "#dcfce7" }}>✓</div>
                  <div>
                    <p className="text-[8px] font-bold text-stone-800">Paiement reçu</p>
                    <p className="text-[7px] text-stone-400">62 000 FCFA</p>
                  </div>
                </div>
                <div className="absolute -left-9 bottom-24 bg-white rounded-2xl px-3 py-2 border border-rose-100" style={{ boxShadow: "0 8px 24px rgba(180,65,106,0.15)" }}>
                  <p className="text-[8px] font-semibold text-stone-800">✂️ Nouveau RDV</p>
                  <p className="text-[7px] text-stone-400">Aminata · 14h00</p>
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
