"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, Menu, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils/formatters";
import { signOut } from "@/lib/actions/auth";
import { useTransition, useRef, useEffect, useState } from "react";

const pageTitles: Record<string, string> = {
  "/": "Tableau de bord",
  "/factures": "Factures",
  "/factures/nouvelle": "Nouvelle facture",
  "/clients": "Clients",
  "/services": "Services & Articles",
  "/stock/mouvements": "Mouvements de stock",
  "/stock": "Gestion du stock",
  "/agents": "Agents",
  "/rendez-vous": "Rendez-vous",
  "/charges": "Charges & Salaires",
  "/parametres": "Paramètres",
};

export function Header({
  alertesStock, nomSalon, onMenuClick,
}: {
  alertesStock: number; nomSalon?: string; onMenuClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  const title = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key))?.[1] ?? "Walima Techno";

  // Initiales depuis le nom du salon
  const initiales = nomSalon
    ? nomSalon.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("")
    : "A";

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = () => {
    setMenuOpen(false);
    startTransition(async () => {
      await signOut();
      router.push("/landing");
    });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base lg:text-lg font-semibold text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">{formatDate(new Date().toISOString())}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="w-64 pl-9 h-9" />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {alertesStock > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {alertesStock}
            </span>
          )}
        </Button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          >
            {initiales}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border bg-white shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-100">
              {/* Nom du salon */}
              {nomSalon && (
                <div className="px-4 py-2.5 border-b">
                  <p className="text-xs text-muted-foreground">Connecté en tant que</p>
                  <p className="text-sm font-semibold truncate">{nomSalon}</p>
                </div>
              )}

              <button
                onClick={() => { setMenuOpen(false); router.push("/parametres"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors text-left"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                Paramètres
              </button>

              <button
                onClick={() => { setMenuOpen(false); router.push("/parametres/utilisateurs"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors text-left"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Mon compte
              </button>

              <div className="border-t my-1" />

              <button
                onClick={handleSignOut}
                disabled={isPending}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors text-left disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                {isPending ? "Déconnexion..." : "Se déconnecter"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
