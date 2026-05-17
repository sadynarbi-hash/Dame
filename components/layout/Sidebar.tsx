"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Users, Scissors,
  Package, Calendar, TrendingDown, Settings, ChevronRight, X,
  UserCheck, BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/factures", label: "Factures", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/agents", label: "Agents", icon: UserCheck },
  { href: "/services", label: "Services", icon: Scissors },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/stock/mouvements", label: "Mouvements stock", icon: BarChart2 },
  { href: "/rendez-vous", label: "Rendez-vous", icon: Calendar },
  { href: "/charges", label: "Charges", icon: TrendingDown },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];

export function Sidebar({ nomSalon, alertesStock, logo, onClose }: { nomSalon: string; alertesStock: number; logo: string | null; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground shadow-xl lg:shadow-none">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-sidebar-accent mr-1">
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary overflow-hidden shrink-0">
          {logo ? (
            <Image src={logo} alt={nomSalon} width={36} height={36} className="object-contain" />
          ) : (
            <Scissors className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="overflow-hidden">
          <p className="truncate text-sm font-bold leading-none">{nomSalon}</p>
          <p className="text-xs text-sidebar-foreground/60 mt-0.5">Gestion salon</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const badge = href === "/stock" && alertesStock > 0 ? alertesStock : null;

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-primary text-white shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
              {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <p className="text-xs text-sidebar-foreground/40 text-center">
          Walima Techno v1.0
        </p>
      </div>
    </aside>
  );
}
