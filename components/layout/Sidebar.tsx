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
import type { Permissions } from "@/lib/auth/context";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard, permKey: "dashboard" as keyof Permissions },
  { href: "/factures", label: "Factures", icon: FileText, permKey: "factures" as keyof Permissions },
  { href: "/clients", label: "Clients", icon: Users, permKey: "clients" as keyof Permissions },
  { href: "/agents", label: "Agents", icon: UserCheck, permKey: "agents" as keyof Permissions },
  { href: "/services", label: "Services", icon: Scissors, permKey: "services" as keyof Permissions },
  { href: "/stock", label: "Stock", icon: Package, permKey: "stock" as keyof Permissions },
  { href: "/stock/mouvements", label: "Mouvements stock", icon: BarChart2, permKey: "stock" as keyof Permissions },
  { href: "/rendez-vous", label: "Rendez-vous", icon: Calendar, permKey: "rendez_vous" as keyof Permissions },
  { href: "/charges", label: "Charges", icon: TrendingDown, permKey: "charges" as keyof Permissions },
  { href: "/parametres", label: "Paramètres", icon: Settings, permKey: "parametres" as keyof Permissions },
];

export function Sidebar({
  nomSalon, alertesStock, logo, onClose, permissions,
}: {
  nomSalon: string; alertesStock: number; logo: string | null;
  onClose?: () => void; permissions?: Permissions | null;
}) {
  const pathname = usePathname();

  const visibleItems = permissions
    ? navItems.filter((item) => permissions[item.permKey])
    : navItems;

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
        {visibleItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href + "/") && !navItems.some(n => n.href !== href && n.href.startsWith(href + "/") && pathname.startsWith(n.href)));
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
