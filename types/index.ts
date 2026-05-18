// ── Statuts ────────────────────────────────────────────────────────────────
export type StatutFacture = "brouillon" | "envoyee" | "payee" | "en_retard" | "partielle";
export type StatutRendezVous = "confirme" | "en_attente" | "annule" | "termine";
export type TypeCharge = "salaire" | "loyer" | "electricite" | "fourniture" | "maintenance" | "autre";
export type UniteStock = "unité" | "litre" | "kg" | "flacon" | "boîte";

// ── Entité de base ─────────────────────────────────────────────────────────
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ── Entreprise ─────────────────────────────────────────────────────────────
export interface Entreprise {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  siteWeb?: string;
  logo?: string;
  siret?: string;
  numeroTva?: string;
  rib?: string;
  mentionsLegales?: string;
}

// ── Client ─────────────────────────────────────────────────────────────────
export interface Client extends BaseEntity {
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  adresse?: string;
  notes?: string;
  totalDepense: number;
  nbFactures: number;
  derniereVisite?: string;
}

// ── Service / Article ──────────────────────────────────────────────────────
export type TypeService = "service" | "article";

export interface Service extends BaseEntity {
  nom: string;
  description?: string;
  type: TypeService;
  prixHT: number;
  prixTTC: number;
  tva: number;
  categorie: string;
  actif: boolean;
}

// ── Ligne de facture ───────────────────────────────────────────────────────
export interface LigneFacture {
  id: string;
  serviceId?: string;
  designation: string;
  quantite: number;
  prixUnitaireHT: number;
  tva: number;
  totalHT: number;
  totalTTC: number;
}

// ── Facture ────────────────────────────────────────────────────────────────
export interface Facture extends BaseEntity {
  numero: string;
  clientId: string;
  client?: Client;
  statut: StatutFacture;
  dateEmission: string;
  dateEcheance: string;
  datePaiement?: string;
  lignes: LigneFacture[];
  sousTotal: number;
  montantTva: number;
  totalTTC: number;
  notes?: string;
  conditions?: string;
}

// ── Stock ──────────────────────────────────────────────────────────────────
export interface ArticleStock extends BaseEntity {
  nom: string;
  reference?: string;
  categorie: string;
  quantite: number;
  unite: UniteStock;
  seuilAlerte: number;
  prixAchat: number;
  fournisseur?: string;
}

// ── Rendez-vous ────────────────────────────────────────────────────────────
export interface RendezVous extends BaseEntity {
  clientId: string;
  client?: Client;
  serviceIds: string[];
  services?: Service[];
  date: string;
  heureDebut: string;
  heureFin: string;
  statut: StatutRendezVous;
  notes?: string;
  montantEstime: number;
}

// ── Charge ─────────────────────────────────────────────────────────────────
export interface Charge extends BaseEntity {
  libelle: string;
  type: TypeCharge;
  montant: number;
  mois: number;
  annee: number;
  description?: string;
  employe?: string;
}

// ── Stats Dashboard ────────────────────────────────────────────────────────
export interface StatsDashboard {
  totalFactures: number;
  montantTotal: number;
  montantPaye: number;
  montantEnAttente: number;
  montantEnRetard: number;
  nbClients: number;
  nbRendezVousSemaine: number;
  evolutionMensuelle: { mois: string; revenus: number; charges: number }[];
  topServices: { nom: string; count: number; revenus: number }[];
  repartitionStatuts: { statut: StatutFacture; count: number; montant: number }[];
}
