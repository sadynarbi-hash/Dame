import Link from "next/link";
import { Scissors, FileText, Users, Calendar, Package, CheckCircle, ArrowRight, Star, Shield, Smartphone, Globe, HeadphonesIcon, TrendingUp, BarChart3, Facebook, Instagram, MessageCircle } from "lucide-react";

/* ─── Palette ─── */
const PINK = "#FF2D78";
const DARK = "#0a0118";
const CARD = "#130428";
const PURPLE = "#7c3aed";

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: DARK, color: "#fff" }}>

      {/* ══ NAV ══ */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b" style={{ backgroundColor: "rgba(10,1,24,0.85)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})` }}>
              <Scissors className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white text-base">Walima Techno</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Témoignages</a>
            <a href="#about" className="hover:text-white transition-colors">À propos</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/connexion">
              <button className="hidden sm:block text-sm px-4 py-2 rounded-full border transition-colors hover:bg-white/10" style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}>
                Se connecter
              </button>
            </Link>
            <Link href="/connexion">
              <button className="text-sm font-semibold px-5 py-2 rounded-full text-white" style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})` }}>
                Essai gratuit
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative pt-24 pb-0 overflow-hidden" style={{ background: `radial-gradient(ellipse 80% 60% at 70% 40%, rgba(124,58,237,0.35) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 65% 55%, rgba(255,45,120,0.25) 0%, transparent 60%), ${DARK}` }}>
        {/* Grid subtil */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative mx-auto max-w-6xl px-5">
          <div className="flex flex-col lg:flex-row items-center gap-8 pb-0">

            {/* ── Texte ── */}
            <div className="flex-1 text-center lg:text-left pt-8 lg:pt-12 pb-8">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-xs font-medium border" style={{ backgroundColor: "rgba(255,45,120,0.1)", borderColor: "rgba(255,45,120,0.3)", color: PINK }}>
                ✦ Pour les salons de coiffure africains
              </div>

              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-5">
                Gérez votre salon<br />
                comme un{" "}
                <span style={{ background: `linear-gradient(90deg, ${PINK}, ${PURPLE})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  business<br />moderne.
                </span>
              </h1>

              <p className="text-base mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Factures, clients, rendez-vous, stock — tout centralisé.<br />
                En FCFA, en français, pensé pour vous.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-7">
                <Link href="/connexion">
                  <button className="flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white" style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})`, boxShadow: `0 0 24px rgba(255,45,120,0.4)` }}>
                    Créer mon salon gratuitement
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/connexion">
                  <button className="flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm border transition-colors hover:bg-white/8" style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}>
                    Voir la démo
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {["AM", "FK", "KD", "MS"].map((l) => (
                    <div key={l} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white" style={{ borderColor: DARK, background: `linear-gradient(135deg, ${PINK}, ${PURPLE})` }}>{l}</div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Plus de 500 salons nous font confiance</p>
                </div>
              </div>
            </div>

            {/* ── Téléphone 3D ── */}
            <div className="shrink-0 flex justify-center pb-0 relative" style={{ paddingRight: "80px", paddingLeft: "80px" }}>
              {/* Glow derrière le téléphone */}
              <div className="absolute inset-0 rounded-full blur-3xl opacity-60" style={{ background: `radial-gradient(ellipse at center, rgba(124,58,237,0.6) 0%, rgba(255,45,120,0.3) 50%, transparent 70%)` }} />

              <div className="relative" style={{ transform: "perspective(900px) rotateY(-6deg) rotateX(2deg)" }}>
                {/* Boutons latéraux */}
                <div className="absolute rounded-l-sm" style={{ left: "-3px", top: "80px", width: "3px", height: "24px", backgroundColor: "#2a1040" }} />
                <div className="absolute rounded-l-sm" style={{ left: "-3px", top: "116px", width: "3px", height: "40px", backgroundColor: "#2a1040" }} />
                <div className="absolute rounded-l-sm" style={{ left: "-3px", top: "166px", width: "3px", height: "40px", backgroundColor: "#2a1040" }} />
                <div className="absolute rounded-r-sm" style={{ right: "-3px", top: "110px", width: "3px", height: "56px", backgroundColor: "#2a1040" }} />

                {/* Cadre téléphone */}
                <div className="relative flex flex-col rounded-[38px] overflow-hidden"
                  style={{ width: "255px", height: "540px", border: "9px solid #1e0a30", backgroundColor: "#0d0520", boxShadow: "0 48px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)" }}>

                  {/* Status bar */}
                  <div className="relative flex items-center justify-between shrink-0 px-5" style={{ height: "34px", backgroundColor: "#0d0520" }}>
                    <span className="font-bold text-[10px] text-white">10:01</span>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full" style={{ width: "68px", height: "16px", backgroundColor: "#000" }} />
                    <span className="text-[8px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>●●● 4G 🔋</span>
                  </div>

                  {/* App content */}
                  <div className="flex-1 overflow-hidden flex flex-col px-3 pt-2" style={{ backgroundColor: "#0d0520" }}>

                    {/* Greeting */}
                    <div className="mb-2.5 shrink-0">
                      <p className="text-[11px] font-bold text-white">Bonjour Awa 👋</p>
                      <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.45)" }}>Voici votre résumé du jour</p>
                    </div>

                    {/* Revenue card */}
                    <div className="rounded-2xl p-3 mb-2.5 shrink-0 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${PINK} 0%, ${PURPLE} 100%)` }}>
                      <div className="absolute top-1 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">+12%</div>
                      <p className="text-[7.5px] text-white/70 mb-0.5">Chiffre d&apos;affaires</p>
                      <p className="text-[20px] font-extrabold text-white leading-none tracking-tight">1 250 000 F</p>
                      <div className="flex gap-3 mt-2">
                        {[{ v: "147", l: "Clientes" }, { v: "38", l: "RDV" }, { v: "8", l: "Att." }].map(s => (
                          <div key={s.l} className="flex flex-col items-center">
                            <span className="text-[10px] font-bold text-white">{s.v}</span>
                            <span className="text-[6px] text-white/60">{s.l}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent */}
                    <div className="flex items-center justify-between mb-1.5 shrink-0">
                      <p className="text-[8px] font-semibold text-white">Factures récentes</p>
                      <span className="text-[7px]" style={{ color: PINK }}>Voir tout</span>
                    </div>
                    <div className="space-y-1.5 flex-1 overflow-hidden">
                      {[
                        { i: "AM", n: "Aminata M.", a: "45 000 F", paid: true },
                        { i: "FK", n: "Fatou K.", a: "28 500 F", paid: false },
                        { i: "MS", n: "Marième S.", a: "62 000 F", paid: true },
                      ].map(f => (
                        <div key={f.n} className="flex items-center gap-2 rounded-xl px-2.5 py-1.5" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0" style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})` }}>{f.i}</div>
                          <div className="flex-1">
                            <p className="text-[8px] font-semibold text-white">{f.n}</p>
                          </div>
                          <span className="text-[7.5px] font-bold text-white">{f.a}</span>
                          <span className="text-[5.5px] px-1.5 py-0.5 rounded-full font-medium" style={f.paid ? { backgroundColor: "rgba(34,197,94,0.2)", color: "#4ade80" } : { backgroundColor: "rgba(255,45,120,0.2)", color: PINK }}>{f.paid ? "Payée" : "Att."}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom nav */}
                  <div className="shrink-0 flex items-end justify-around pb-2 pt-1.5" style={{ height: "52px", backgroundColor: "#0d0520", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {[{ e: "🏠", l: "Accueil", a: true }, { e: "👥", l: "Clients" }, { fab: true, l: "+" }, { e: "📄", l: "Factures" }, { e: "⋯", l: "Autres" }].map((item, i) =>
                      item.fab ? (
                        <div key={i} className="flex flex-col items-center" style={{ marginTop: "-16px" }}>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-base font-bold" style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})`, boxShadow: `0 0 16px rgba(255,45,120,0.5)` }}>+</div>
                        </div>
                      ) : (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                          <span className="text-sm leading-none">{item.e}</span>
                          <span className="text-[5.5px]" style={{ color: item.a ? PINK : "rgba(255,255,255,0.35)" }}>{item.l}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute rounded-2xl px-3 py-2.5 shadow-2xl" style={{ top: "52px", right: "-90px", backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.3)", minWidth: "140px" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${PURPLE}, #4f46e5)` }}>AM</div>
                    <div>
                      <p className="text-[7px] font-semibold text-stone-500">Nouveau client</p>
                      <p className="text-[9px] font-bold text-stone-800">Aminata M.</p>
                    </div>
                  </div>
                </div>

                <div className="absolute rounded-2xl px-3 py-2.5 shadow-2xl" style={{ bottom: "160px", left: "-95px", backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.3)", minWidth: "130px" }}>
                  <p className="text-[7px] font-semibold text-stone-500 mb-1">📅 Rendez-vous</p>
                  <p className="text-[13px] font-extrabold text-stone-800">12 <span className="text-[8px] font-medium text-stone-500">Aujourd&apos;hui</span></p>
                  <p className="text-[7px] text-stone-500">5 rendez-vous</p>
                </div>

                <div className="absolute rounded-2xl px-3 py-2.5 shadow-2xl" style={{ bottom: "80px", right: "-95px", backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.3)", minWidth: "130px" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px]">⚠️</span>
                    <p className="text-[7px] font-semibold text-amber-600">Stock faible</p>
                  </div>
                  <p className="text-[8.5px] font-bold text-stone-800">Shampooing</p>
                  <p className="text-[7px] text-stone-500">Reste : 3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST BAR ══ */}
      <section className="py-10 px-5 border-y" style={{ backgroundColor: "#fff", borderColor: "#f3f4f6" }}>
        <p className="text-center text-sm font-semibold text-stone-400 mb-6 uppercase tracking-widest">Ils nous font confiance</p>
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {[
            { icon: "✂️", name: "Beauty Palace" },
            { icon: "💅", name: "Néné Coiffure" },
            { icon: "🌸", name: "Afro Style" },
            { icon: "👑", name: "Dakar Hair" },
            { icon: "💎", name: "Queen's Braids" },
            { icon: "🌺", name: "Beauty House" },
          ].map(s => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="text-base">{s.icon}</span>
              <span className="text-sm font-semibold text-stone-500">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" className="py-20 px-5 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Tout ce dont <span style={{ color: PINK }}>votre salon</span> a besoin
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, title: "Gestion des clients", desc: "Ajoutez, suivez et fidélisez vos clients facilement." },
              { icon: FileText, title: "Facturation simple", desc: "Créez des factures en quelques secondes, en FCFA." },
              { icon: Calendar, title: "Rendez-vous", desc: "Planifiez et gérez vos rendez-vous sans stress." },
              { icon: Package, title: "Gestion du stock", desc: "Suivez vos produits et recevez des alertes en temps réel." },
            ].map(f => (
              <div key={f.title} className="rounded-2xl p-6 border border-stone-100 hover:shadow-lg transition-all hover:-translate-y-0.5" style={{ backgroundColor: "#fafafa" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${PINK}20, ${PURPLE}20)` }}>
                  <f.icon className="h-5 w-5" style={{ color: PURPLE }} />
                </div>
                <h3 className="font-bold text-stone-900 text-sm mb-2">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-12 rounded-2xl p-6 sm:p-8" style={{ background: `linear-gradient(135deg, #1a0535, #2d0a52)` }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { value: "500+", label: "Salons actifs" },
                { value: "50 000+", label: "Factures créées" },
                { value: "98%", label: "Clients satisfaits" },
                { value: "3", label: "Pays — Sénégal, Côte d'Ivoire, Mali" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold" style={{ color: PINK }}>{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIAL + WHY ══ */}
      <section id="testimonials" className="py-20 px-5 bg-white border-t border-stone-100">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Témoignage */}
          <div className="rounded-2xl p-8 border border-stone-100" style={{ backgroundColor: "#fafafa" }}>
            <div className="flex gap-0.5 mb-5">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
            </div>
            <blockquote className="text-stone-700 text-base leading-relaxed italic mb-6">
              &ldquo;Grâce à Walima Techno, je gagne du temps et je connais vraiment mon chiffre d&apos;affaires.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})` }}>AD</div>
              <div>
                <p className="font-bold text-stone-900 text-sm">Aissatou Diallo</p>
                <p className="text-stone-400 text-xs">Néné Coiffure, Dakar</p>
              </div>
            </div>
            {/* Dots */}
            <div className="flex gap-1.5 mt-5">
              {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? PINK : "#e5e7eb" }} />)}
            </div>
          </div>

          {/* Pourquoi */}
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mb-7">
              Pourquoi choisir <span style={{ color: PINK }}>Walima Techno</span> ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "🇫🇷", text: "100% en français" },
                { icon: "📱", text: "Accessible sur mobile" },
                { icon: "💰", text: "Paiement en FCFA" },
                { icon: Shield, text: "Sécurisé et fiable" },
                { icon: "🌍", text: "Pensé pour l'Afrique" },
                { icon: HeadphonesIcon, text: "Support client local" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${PINK}15` }}>
                    {typeof item.icon === "string"
                      ? <span className="text-base">{item.icon}</span>
                      : <item.icon className="h-4 w-4" style={{ color: PINK }} />}
                  </div>
                  <span className="text-sm font-medium text-stone-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" className="py-20 px-5" style={{ backgroundColor: "#f1f4f9" }}>
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "#0f1f3d" }}>
              Des tarifs <span style={{ color: PINK }}>simples</span> et adaptés
            </h2>
          </div>
          <p className="text-center text-sm mb-3" style={{ color: "#6b7280" }}>
            Essai gratuit 14 jours — sans carte bancaire
          </p>
          <div className="flex justify-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 rounded-full border" style={{ backgroundColor: "rgba(255,45,120,0.07)", borderColor: "rgba(255,45,120,0.2)", color: PINK }}>
              ✦ Tous les plans incluent l&apos;accès mobile (PWA)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* ── Gratuit ── */}
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-stone-200">
              <p className="text-2xl font-extrabold mb-1" style={{ color: "#0f1f3d" }}>Gratuit</p>
              <p className="text-sm mb-6" style={{ color: "#6b7280" }}>Pour découvrir l&apos;application</p>

              <div className="mb-8">
                <span className="text-3xl font-extrabold" style={{ color: "#0f1f3d" }}>0</span>
                <span className="text-base font-semibold ml-1.5" style={{ color: "#6b7280" }}>FCFA/mois</span>
              </div>

              <ul className="space-y-0 mb-8">
                {[
                  "5 factures/mois",
                  "1 utilisateur",
                  "Clients et rendez-vous",
                  "Gestion de stock basique",
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0">
                    <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "#22c55e" }} />
                    <span className="text-sm" style={{ color: "#374151" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/connexion">
                <button className="w-full py-3 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-stone-50" style={{ borderColor: "#d1d5db", color: "#374151" }}>
                  Commencer gratuitement
                </button>
              </Link>
            </div>

            {/* ── Starter ── */}
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-stone-200">
              <p className="text-2xl font-extrabold mb-1" style={{ color: "#0f1f3d" }}>Starter</p>
              <p className="text-sm mb-6" style={{ color: "#6b7280" }}>Pour les petites entreprises</p>

              <div className="mb-8">
                <span className="text-3xl font-extrabold" style={{ color: "#0f1f3d" }}>4 500</span>
                <span className="text-base font-semibold ml-1.5" style={{ color: PINK }}>FCFA/mois</span>
              </div>

              <ul className="space-y-0 mb-8">
                {[
                  "100 factures/mois",
                  "1 utilisateur",
                  "Gestion de stock basique",
                  "Support email",
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0">
                    <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "#22c55e" }} />
                    <span className="text-sm" style={{ color: "#374151" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/connexion">
                <button className="w-full py-3 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-stone-50" style={{ borderColor: "#d1d5db", color: "#374151" }}>
                  Commencer
                </button>
              </Link>
            </div>

            {/* ── Business — highlighted ── */}
            <div className="rounded-2xl bg-white p-8 shadow-lg border-2 relative" style={{ borderColor: "#0f1f3d" }}>
              {/* Badge POPULAIRE */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, #f97316, #0f1f3d)` }}>
                  ★ POPULAIRE
                </span>
              </div>

              <p className="text-2xl font-extrabold mb-1" style={{ color: "#0f1f3d" }}>Business</p>
              <p className="text-sm mb-6" style={{ color: "#6b7280" }}>Pour les entreprises en croissance</p>

              <div className="mb-8">
                <span className="text-3xl font-extrabold" style={{ color: "#0f1f3d" }}>7 500</span>
                <span className="text-base font-semibold ml-1.5" style={{ color: PINK }}>FCFA/mois</span>
              </div>

              <ul className="space-y-0 mb-8">
                {[
                  "Factures illimitées",
                  "5 utilisateurs",
                  "Gestion de stock avancée",
                  "Application mobile",
                  "Support prioritaire",
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0">
                    <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "#22c55e" }} />
                    <span className="text-sm" style={{ color: "#374151" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/connexion">
                <button className="w-full py-3 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-stone-50" style={{ borderColor: "#d1d5db", color: "#374151" }}>
                  Commencer
                </button>
              </Link>
            </div>
          </div>

          <p className="text-center text-xs mt-8" style={{ color: "#9ca3af" }}>
            Résiliez à tout moment · Paiement par Wave, Orange Money ou virement
          </p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="px-5 pt-14 pb-8 border-t" style={{ backgroundColor: "#07010f", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>

            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})` }}>
                  <Scissors className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-white">Walima Techno</span>
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                La solution de gestion pensée pour les salons de coiffure africains.
              </p>
              <div className="flex gap-3">
                {[{ icon: Facebook, label: "Facebook" }, { icon: Instagram, label: "Instagram" }, { icon: MessageCircle, label: "WhatsApp" }].map(s => (
                  <button key={s.label} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/15" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                    <s.icon className="h-3.5 w-3.5" style={{ color: "rgba(255,255,255,0.6)" }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Produit */}
            <div>
              <p className="text-sm font-semibold text-white mb-4">Produit</p>
              <ul className="space-y-2.5">
                {["Fonctionnalités", "Tarifs", "Mises à jour"].map(l => (
                  <li key={l}><a href="#" className="text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Ressources */}
            <div>
              <p className="text-sm font-semibold text-white mb-4">Ressources</p>
              <ul className="space-y-2.5">
                {["Blog", "Centre d'aide", "Guides"].map(l => (
                  <li key={l}><a href="#" className="text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-sm font-semibold text-white mb-4">Besoin d&apos;aide ?</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📱</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>+221 77 123 45 67</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">✉️</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>hello@walimatechno.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>© {new Date().getFullYear()} Walima Techno. Tous droits réservés.</p>
            <div className="flex gap-5">
              {["À propos", "Contact", "Confidentialité"].map(l => (
                <a key={l} href="#" className="text-xs hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
