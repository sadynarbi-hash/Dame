import Link from "next/link";
import {
  Scissors, FileText, Users, Calendar, Package,
  TrendingDown, BarChart3, CheckCircle, ArrowRight,
  Star, Zap, Shield, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Facturation professionnelle",
    desc: "Créez des factures avec TVA 18%, envoyez-les et suivez les paiements. Numérotation automatique, relances simplifiées.",
  },
  {
    icon: Users,
    title: "Gestion des clients",
    desc: "Carnet de clients complet : historique des visites, montant total dépensé, coordonnées centralisées.",
  },
  {
    icon: Calendar,
    title: "Rendez-vous",
    desc: "Planifiez vos rendez-vous, confirmez ou annulez en un clic. Vue journalière et hebdomadaire.",
  },
  {
    icon: Package,
    title: "Stock & produits",
    desc: "Gérez vos produits capillaires avec alertes de réapprovisionnement. Plus jamais en rupture.",
  },
  {
    icon: TrendingDown,
    title: "Charges & salaires",
    desc: "Enregistrez loyer, salaires, fournitures. Analysez la rentabilité de votre salon mois par mois.",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord",
    desc: "Vue d'ensemble de votre activité : revenus, factures en attente, alertes stock, graphiques mensuels.",
  },
];

const steps = [
  { num: "01", title: "Créez votre compte", desc: "Inscription gratuite en 30 secondes. Entrez le nom de votre salon et votre email." },
  { num: "02", title: "Configurez votre salon", desc: "Ajoutez vos services, vos tarifs, vos informations légales pour vos factures." },
  { num: "03", title: "Gérez votre activité", desc: "Créez factures et rendez-vous, suivez votre stock, analysez vos revenus." },
];

const testimonials = [
  {
    name: "Aminata D.",
    salon: "Salon Beauté Dakar",
    text: "Avant, je perdais des heures à rédiger mes factures à la main. Maintenant c'est fait en 2 minutes. Mes clients adorent la présentation professionnelle.",
  },
  {
    name: "Fatoumata K.",
    salon: "Espace Coiffure Abidjan",
    text: "Le suivi du stock m'a sauvé plusieurs fois. Les alertes me préviennent avant que je sois en rupture de shampoing.",
  },
  {
    name: "Marième S.",
    salon: "Tresses & Beauté Bamako",
    text: "Enfin un logiciel pensé pour les salons africains. Les montants en FCFA, les services adaptés à notre métier. Je recommande à toutes mes collègues.",
  },
];

const stats = [
  { value: "500+", label: "Salons actifs" },
  { value: "50 000+", label: "Factures créées" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "3 pays", label: "Sénégal, Côte d'Ivoire, Mali" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-900">
              <Scissors className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Walima Techno</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/connexion">
              <Button variant="ghost" size="sm">Se connecter</Button>
            </Link>
            <Link href="/connexion">
              <Button size="sm" className="bg-purple-900 hover:bg-purple-800">Essai gratuit</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="mx-auto max-w-6xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Zap className="h-3 w-3 mr-1" />
                Spécialement conçu pour les salons africains
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                La gestion de votre salon,{" "}
                <span className="text-purple-300">enfin simple</span>
              </h1>
              <p className="text-lg sm:text-xl text-purple-100 mb-10 max-w-xl leading-relaxed">
                Factures professionnelles, gestion des clients, rendez-vous, stock et charges — tout en un.
                En FCFA, en français, pensé pour vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/connexion">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-purple-900 hover:bg-purple-50 font-semibold text-base px-8">
                    Démarrer gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/connexion">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 text-base px-8">
                    Voir la démo
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-purple-300">
                Gratuit pour commencer · Aucune carte bancaire requise
              </p>
            </div>

            {/* Right: phone mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-56 h-10 bg-purple-400/40 blur-2xl rounded-full" />

                {/* Phone frame */}
                <div className="relative w-[270px] h-[550px] bg-[#111] rounded-[44px] border-[10px] border-[#222] shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#111] rounded-b-2xl z-10" />
                  {/* Status bar */}
                  <div className="h-6 bg-[#1c1917] flex items-center justify-between px-5 pt-1">
                    <span className="text-white text-[9px] font-medium">9:41</span>
                    <span className="text-white/60 text-[8px]">▌▌▌ WiFi 🔋</span>
                  </div>

                  {/* App UI */}
                  <div className="flex h-full bg-[#f9f7f5]">
                    {/* Sidebar */}
                    <div className="w-[72px] bg-[#292524] flex flex-col py-2 shrink-0">
                      {/* Logo */}
                      <div className="flex justify-center mb-3">
                        <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center">
                          <Scissors className="h-3.5 w-3.5 text-white" />
                        </div>
                      </div>

                      {[
                        { icon: BarChart3, label: "Dashboard", active: true },
                        { icon: FileText, label: "Factures", active: false },
                        { icon: Users, label: "Clients", active: false },
                        { icon: Scissors, label: "Services", active: false },
                        { icon: Package, label: "Stock", active: false },
                        { icon: Calendar, label: "RDV", active: false },
                        { icon: TrendingDown, label: "Charges", active: false },
                      ].map(({ icon: Icon, label, active }) => (
                        <div
                          key={label}
                          className={`mx-1.5 mb-0.5 px-1 py-1.5 rounded-lg flex flex-col items-center gap-0.5 ${active ? "bg-purple-700" : ""}`}
                        >
                          <Icon className={`h-3.5 w-3.5 ${active ? "text-white" : "text-white/50"}`} />
                          <span className={`text-[7px] leading-tight text-center ${active ? "text-white" : "text-white/40"}`}>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 p-2.5 overflow-hidden">
                      <p className="text-[9px] font-bold text-gray-800 mb-2">Tableau de bord</p>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-1 mb-2.5">
                        {[
                          { label: "Revenus", value: "1,2M FCFA", bg: "bg-green-50", text: "text-green-700" },
                          { label: "Clients", value: "147", bg: "bg-blue-50", text: "text-blue-700" },
                          { label: "Factures att.", value: "8", bg: "bg-yellow-50", text: "text-yellow-700" },
                          { label: "RDV auj.", value: "5", bg: "bg-purple-50", text: "text-purple-700" },
                        ].map((s) => (
                          <div key={s.label} className={`${s.bg} rounded-lg p-1.5`}>
                            <p className="text-[6px] text-gray-500">{s.label}</p>
                            <p className={`text-[9px] font-bold ${s.text}`}>{s.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Recent invoices */}
                      <p className="text-[7px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Factures récentes</p>
                      {[
                        { client: "Aminata D.", montant: "45 000", paid: true },
                        { client: "Fatou K.", montant: "28 500", paid: false },
                        { client: "Marième S.", montant: "62 000", paid: true },
                      ].map((f) => (
                        <div key={f.client} className="flex items-center justify-between bg-white rounded-lg px-1.5 py-1 mb-0.5 shadow-sm">
                          <span className="text-[7px] text-gray-700 font-medium">{f.client}</span>
                          <span className="text-[7px] font-bold text-gray-800">{f.montant}</span>
                          <span className={`text-[6px] px-1 py-0.5 rounded-full font-medium ${f.paid ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                            {f.paid ? "Payée" : "En att."}
                          </span>
                        </div>
                      ))}

                      {/* Alert */}
                      <div className="mt-1.5 bg-orange-50 border border-orange-200 rounded-lg px-1.5 py-1 flex items-center gap-1">
                        <span className="text-[7px]">⚠️</span>
                        <span className="text-[6px] text-orange-700">2 produits en stock faible</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -right-4 top-16 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2 border border-gray-100">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-800">Facture envoyée</p>
                    <p className="text-[8px] text-gray-500">45 000 FCFA</p>
                  </div>
                </div>

                <div className="absolute -left-6 bottom-24 bg-white rounded-2xl shadow-xl px-3 py-2 border border-gray-100">
                  <p className="text-[9px] font-bold text-gray-800">📅 Rappel RDV</p>
                  <p className="text-[8px] text-gray-500">Aminata — 14h00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Chiffre du mois", value: "1 250 000 FCFA", color: "text-green-400" },
                { label: "Factures en attente", value: "8 factures", color: "text-yellow-400" },
                { label: "Rendez-vous cette semaine", value: "24 RDV", color: "text-blue-400" },
                { label: "Alertes stock", value: "2 produits", color: "text-orange-400" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-white/10 p-3 text-center">
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-purple-200 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-purple-50 border-y border-purple-100">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-purple-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-purple-100 text-purple-800 border-purple-200">Fonctionnalités</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Tout ce dont votre salon a besoin</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Une suite complète d&apos;outils pour gérer votre salon au quotidien, de la facturation au suivi des stocks.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="group hover:shadow-lg transition-all hover:-translate-y-0.5 border-gray-100">
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 group-hover:bg-purple-200 transition-colors mb-4">
                    <f.icon className="h-5 w-5 text-purple-800" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-purple-100 text-purple-800 border-purple-200">Démarrage rapide</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Opérationnel en moins de 5 minutes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[calc(50%+2.5rem)] right-0 h-px bg-purple-200" />
                )}
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-900 text-white font-bold text-lg mb-4">
                  {s.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-purple-100 text-purple-800 border-purple-200">Témoignages</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Ce qu&apos;en disent nos clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-gray-100">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.salon}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-purple-100 text-purple-800 border-purple-200">Tarifs</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Commencez gratuitement</h2>
            <p className="text-gray-500 mt-3">Pas de surprise, pas d&apos;engagement.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <Card className="border-gray-200">
              <CardContent className="p-8">
                <p className="text-sm font-medium text-gray-500 mb-1">Gratuit</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">0 FCFA</p>
                <p className="text-sm text-gray-500 mb-6">Pour démarrer</p>
                <ul className="space-y-3 mb-8">
                  {["Jusqu'à 20 factures/mois", "50 clients", "Gestion stock basique", "Tableau de bord"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/connexion" className="block">
                  <Button variant="outline" className="w-full">Commencer</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Pro */}
            <Card className="border-purple-900 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-purple-900" />
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-purple-800">Pro</p>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">Populaire</Badge>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-1">
                  9 900 <span className="text-2xl font-semibold">FCFA</span>
                </p>
                <p className="text-sm text-gray-500 mb-6">par mois</p>
                <ul className="space-y-3 mb-8">
                  {["Factures illimitées", "Clients illimités", "Rendez-vous & rappels", "Gestion charges & salaires", "Export PDF & Excel", "Support prioritaire"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-purple-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/connexion" className="block">
                  <Button className="w-full bg-purple-900 hover:bg-purple-800">Démarrer l&apos;essai gratuit</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-12 px-4 border-y bg-white">
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Shield className="h-7 w-7 text-purple-800" />
            <p className="font-semibold text-gray-900">Données sécurisées</p>
            <p className="text-sm text-gray-500">Hébergement cloud chiffré, sauvegardes automatiques quotidiennes.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Globe className="h-7 w-7 text-purple-800" />
            <p className="font-semibold text-gray-900">Accessible partout</p>
            <p className="text-sm text-gray-500">Depuis votre téléphone, tablette ou ordinateur. Fonctionne hors ligne.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap className="h-7 w-7 text-purple-800" />
            <p className="font-semibold text-gray-900">Mises à jour gratuites</p>
            <p className="text-sm text-gray-500">Nouvelles fonctionnalités incluses sans frais supplémentaires.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-700 text-white text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Prêt à professionnaliser votre salon ?
          </h2>
          <p className="text-purple-200 text-lg mb-8">
            Rejoignez plus de 500 salons qui font confiance à Walima Techno pour leur gestion quotidienne.
          </p>
          <Link href="/connexion">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50 font-semibold text-base px-10">
              Créer mon compte gratuit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-purple-300">Installation en 2 minutes · Aucune carte requise</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-900 text-gray-400">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-800">
              <Scissors className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">Walima Techno</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Walima Techno. Tous droits réservés.</p>
          <div className="flex gap-4 text-sm">
            <Link href="/connexion" className="hover:text-white transition-colors">Connexion</Link>
            <Link href="/connexion" className="hover:text-white transition-colors">S&apos;inscrire</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
