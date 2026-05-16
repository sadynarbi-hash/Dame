"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Client, Facture, Service, ArticleStock,
  RendezVous, Charge, Entreprise, StatutFacture,
} from "@/types";
import { mockClients } from "@/lib/mock/clients";
import { mockFactures } from "@/lib/mock/factures";
import { mockServices } from "@/lib/mock/services";
import { mockStock } from "@/lib/mock/stock";
import { mockRendezVous } from "@/lib/mock/rendez-vous";
import { mockCharges } from "@/lib/mock/charges";
import { mockEntreprise } from "@/lib/mock/entreprise";
import { genererNumeroFacture } from "@/lib/utils/formatters";

// ── Helpers ────────────────────────────────────────────────────────────────
function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function now(): string { return new Date().toISOString(); }

// ── Store principal ────────────────────────────────────────────────────────
interface SalonStore {
  // State
  clients: Client[];
  factures: Facture[];
  services: Service[];
  stock: ArticleStock[];
  rendezVous: RendezVous[];
  charges: Charge[];
  entreprise: Entreprise;

  // Clients
  addClient: (data: Omit<Client, "id" | "createdAt" | "updatedAt" | "totalDepense" | "nbFactures">) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Factures
  addFacture: (data: Omit<Facture, "id" | "numero" | "createdAt" | "updatedAt">) => Facture;
  updateFacture: (id: string, data: Partial<Facture>) => void;
  updateStatutFacture: (id: string, statut: StatutFacture) => void;
  deleteFacture: (id: string) => void;

  // Services
  addService: (data: Omit<Service, "id" | "createdAt" | "updatedAt">) => Service;
  updateService: (id: string, data: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Stock
  addArticleStock: (data: Omit<ArticleStock, "id" | "createdAt" | "updatedAt">) => ArticleStock;
  updateArticleStock: (id: string, data: Partial<ArticleStock>) => void;
  deleteArticleStock: (id: string) => void;
  ajusterQuantite: (id: string, delta: number) => void;

  // Rendez-vous
  addRendezVous: (data: Omit<RendezVous, "id" | "createdAt" | "updatedAt">) => RendezVous;
  updateRendezVous: (id: string, data: Partial<RendezVous>) => void;
  deleteRendezVous: (id: string) => void;

  // Charges
  addCharge: (data: Omit<Charge, "id" | "createdAt" | "updatedAt">) => Charge;
  updateCharge: (id: string, data: Partial<Charge>) => void;
  deleteCharge: (id: string) => void;

  // Entreprise
  updateEntreprise: (data: Partial<Entreprise>) => void;
}

export const useSalonStore = create<SalonStore>()(
  persist(
    (set, get) => ({
      clients: mockClients,
      factures: mockFactures,
      services: mockServices,
      stock: mockStock,
      rendezVous: mockRendezVous,
      charges: mockCharges,
      entreprise: mockEntreprise,

      // Clients
      addClient: (data) => {
        const client: Client = {
          ...data, id: newId("cl"), totalDepense: 0, nbFactures: 0,
          createdAt: now(), updatedAt: now(),
        };
        set((s) => ({ clients: [...s.clients, client] }));
        return client;
      },
      updateClient: (id, data) =>
        set((s) => ({ clients: s.clients.map((c) => c.id === id ? { ...c, ...data, updatedAt: now() } : c) })),
      deleteClient: (id) =>
        set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),

      // Factures
      addFacture: (data) => {
        const facture: Facture = {
          ...data,
          id: newId("fac"),
          numero: genererNumeroFacture(get().factures.length + 1),
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({
          factures: [...s.factures, facture],
          clients: s.clients.map((c) =>
            c.id === facture.clientId
              ? { ...c, nbFactures: c.nbFactures + 1, totalDepense: c.totalDepense + (facture.statut === "payee" ? facture.totalTTC : 0) }
              : c
          ),
        }));
        return facture;
      },
      updateFacture: (id, data) =>
        set((s) => ({ factures: s.factures.map((f) => f.id === id ? { ...f, ...data, updatedAt: now() } : f) })),
      updateStatutFacture: (id, statut) =>
        set((s) => ({
          factures: s.factures.map((f) =>
            f.id === id ? { ...f, statut, datePaiement: statut === "payee" ? now().split("T")[0] : f.datePaiement, updatedAt: now() } : f
          ),
        })),
      deleteFacture: (id) =>
        set((s) => ({ factures: s.factures.filter((f) => f.id !== id) })),

      // Services
      addService: (data) => {
        const service: Service = { ...data, id: newId("sv"), createdAt: now(), updatedAt: now() };
        set((s) => ({ services: [...s.services, service] }));
        return service;
      },
      updateService: (id, data) =>
        set((s) => ({ services: s.services.map((sv) => sv.id === id ? { ...sv, ...data, updatedAt: now() } : sv) })),
      deleteService: (id) =>
        set((s) => ({ services: s.services.filter((sv) => sv.id !== id) })),

      // Stock
      addArticleStock: (data) => {
        const article: ArticleStock = { ...data, id: newId("st"), createdAt: now(), updatedAt: now() };
        set((s) => ({ stock: [...s.stock, article] }));
        return article;
      },
      updateArticleStock: (id, data) =>
        set((s) => ({ stock: s.stock.map((a) => a.id === id ? { ...a, ...data, updatedAt: now() } : a) })),
      deleteArticleStock: (id) =>
        set((s) => ({ stock: s.stock.filter((a) => a.id !== id) })),
      ajusterQuantite: (id, delta) =>
        set((s) => ({
          stock: s.stock.map((a) =>
            a.id === id ? { ...a, quantite: Math.max(0, a.quantite + delta), updatedAt: now() } : a
          ),
        })),

      // Rendez-vous
      addRendezVous: (data) => {
        const rdv: RendezVous = { ...data, id: newId("rdv"), createdAt: now(), updatedAt: now() };
        set((s) => ({ rendezVous: [...s.rendezVous, rdv] }));
        return rdv;
      },
      updateRendezVous: (id, data) =>
        set((s) => ({ rendezVous: s.rendezVous.map((r) => r.id === id ? { ...r, ...data, updatedAt: now() } : r) })),
      deleteRendezVous: (id) =>
        set((s) => ({ rendezVous: s.rendezVous.filter((r) => r.id !== id) })),

      // Charges
      addCharge: (data) => {
        const charge: Charge = { ...data, id: newId("ch"), createdAt: now(), updatedAt: now() };
        set((s) => ({ charges: [...s.charges, charge] }));
        return charge;
      },
      updateCharge: (id, data) =>
        set((s) => ({ charges: s.charges.map((c) => c.id === id ? { ...c, ...data, updatedAt: now() } : c) })),
      deleteCharge: (id) =>
        set((s) => ({ charges: s.charges.filter((c) => c.id !== id) })),

      // Entreprise
      updateEntreprise: (data) =>
        set((s) => ({ entreprise: { ...s.entreprise, ...data } })),
    }),
    {
      name: "salon-facture-store",
      partialize: (s) => ({
        clients: s.clients, factures: s.factures, services: s.services,
        stock: s.stock, rendezVous: s.rendezVous, charges: s.charges, entreprise: s.entreprise,
      }),
    }
  )
);

// ── Sélecteurs calculés ────────────────────────────────────────────────────
export function useStatsDashboard() {
  const { factures, clients, rendezVous, charges } = useSalonStore();
  const aujourd_hui = new Date().toISOString().split("T")[0];

  const payees = factures.filter((f) => f.statut === "payee");
  const enAttente = factures.filter((f) => f.statut === "envoyee");
  const enRetard = factures.filter((f) => f.statut === "en_retard");

  const montantPaye = payees.reduce((s, f) => s + f.totalTTC, 0);
  const montantEnAttente = enAttente.reduce((s, f) => s + f.totalTTC, 0);
  const montantEnRetard = enRetard.reduce((s, f) => s + f.totalTTC, 0);

  const nbRdvSemaine = rendezVous.filter((r) => {
    const d = new Date(r.date);
    const debut = new Date(aujourd_hui);
    debut.setDate(debut.getDate() - debut.getDay());
    const fin = new Date(debut);
    fin.setDate(fin.getDate() + 6);
    return d >= debut && d <= fin;
  }).length;

  // Évolution 6 derniers mois
  const moisLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const evolutionMensuelle = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth() + 1;
    const a = d.getFullYear();
    const revenus = factures
      .filter((f) => f.statut === "payee" && f.datePaiement?.startsWith(`${a}-${String(m).padStart(2, "0")}`))
      .reduce((s, f) => s + f.totalTTC, 0);
    const ch = charges
      .filter((c) => c.mois === m && c.annee === a)
      .reduce((s, c) => s + c.montant, 0);
    return { mois: moisLabels[m - 1], revenus, charges: ch };
  });

  return {
    totalFactures: factures.length,
    montantTotal: factures.reduce((s, f) => s + f.totalTTC, 0),
    montantPaye,
    montantEnAttente,
    montantEnRetard,
    nbClients: clients.length,
    nbRendezVousSemaine: nbRdvSemaine,
    evolutionMensuelle,
  };
}
