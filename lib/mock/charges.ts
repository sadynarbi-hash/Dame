import type { Charge } from "@/types";

export const mockCharges: Charge[] = [
  { id: "ch-001", libelle: "Salaire - Aïssatou Dieng", type: "salaire", montant: 150000, mois: 5, annee: 2026, employe: "Aïssatou Dieng", createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
  { id: "ch-002", libelle: "Salaire - Mariama Baldé", type: "salaire", montant: 120000, mois: 5, annee: 2026, employe: "Mariama Baldé", createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
  { id: "ch-003", libelle: "Loyer local commercial", type: "loyer", montant: 200000, mois: 5, annee: 2026, createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
  { id: "ch-004", libelle: "Achat produits coiffure", type: "fourniture", montant: 85000, mois: 5, annee: 2026, description: "Réapprovisionnement stock", createdAt: "2026-05-05T00:00:00Z", updatedAt: "2026-05-05T00:00:00Z" },
  { id: "ch-005", libelle: "Électricité et eau", type: "autre", montant: 35000, mois: 5, annee: 2026, createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z" },
  { id: "ch-006", libelle: "Maintenance climatiseur", type: "maintenance", montant: 25000, mois: 5, annee: 2026, description: "Révision annuelle", createdAt: "2026-05-10T00:00:00Z", updatedAt: "2026-05-10T00:00:00Z" },
  // Avril
  { id: "ch-007", libelle: "Salaire - Aïssatou Dieng", type: "salaire", montant: 150000, mois: 4, annee: 2026, employe: "Aïssatou Dieng", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "ch-008", libelle: "Salaire - Mariama Baldé", type: "salaire", montant: 120000, mois: 4, annee: 2026, employe: "Mariama Baldé", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "ch-009", libelle: "Loyer local commercial", type: "loyer", montant: 200000, mois: 4, annee: 2026, createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
  { id: "ch-010", libelle: "Achat produits coiffure", type: "fourniture", montant: 60000, mois: 4, annee: 2026, createdAt: "2026-04-08T00:00:00Z", updatedAt: "2026-04-08T00:00:00Z" },
  { id: "ch-011", libelle: "Électricité et eau", type: "autre", montant: 32000, mois: 4, annee: 2026, createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z" },
];
