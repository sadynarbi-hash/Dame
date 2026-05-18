"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import type { Permissions } from "@/lib/auth/context";

interface LayoutClientProps {
  children: React.ReactNode;
  nomSalon: string;
  alertesStock: number;
  logo: string | null;
  permissions?: Permissions | null;
}

export function LayoutClient({ children, nomSalon, alertesStock, logo, permissions }: LayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:flex lg:shrink-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar
          nomSalon={nomSalon}
          alertesStock={alertesStock}
          logo={logo}
          permissions={permissions}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header alertesStock={alertesStock} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </>
  );
}
