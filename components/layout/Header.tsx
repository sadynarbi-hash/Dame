"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils/formatters";

const pageTitles: Record<string, string> = {
  "/": "Tableau de bord",
  "/factures": "Factures",
  "/factures/nouvelle": "Nouvelle facture",
  "/clients": "Clients",
  "/services": "Services & Articles",
  "/stock": "Gestion du stock",
  "/rendez-vous": "Rendez-vous",
  "/charges": "Charges & Salaires",
  "/parametres": "Paramètres",
};

export function Header({ alertesStock }: { alertesStock: number }) {
  const pathname = usePathname();

  const title = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key))?.[1] ?? "Walima Techno";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">{formatDate(new Date().toISOString())}</p>
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

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          A
        </div>
      </div>
    </header>
  );
}
