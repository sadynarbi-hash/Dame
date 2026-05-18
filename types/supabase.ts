// Types générés à partir du schéma Supabase
// Pour régénérer : npx supabase gen types typescript --project-id <id> > types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      entreprises: {
        Row: {
          id: string; user_id: string; nom: string; adresse: string;
          telephone: string; email: string; site_web: string | null;
          logo: string | null; couleur_principale: string | null;
          siret: string | null; numero_tva: string | null;
          rib: string | null; mentions_legales: string | null;
          trial_ends_at: string | null; abonnement_statut: string | null;
          abonnement_plan: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; user_id: string; nom: string; adresse: string;
          telephone: string; email: string; site_web?: string | null;
          logo?: string | null; couleur_principale?: string | null;
          siret?: string | null; numero_tva?: string | null;
          rib?: string | null; mentions_legales?: string | null;
          trial_ends_at?: string | null; abonnement_statut?: string | null;
          abonnement_plan?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; user_id?: string; nom?: string; adresse?: string;
          telephone?: string; email?: string; site_web?: string | null;
          logo?: string | null; couleur_principale?: string | null;
          siret?: string | null; numero_tva?: string | null;
          rib?: string | null; mentions_legales?: string | null;
          trial_ends_at?: string | null; abonnement_statut?: string | null;
          abonnement_plan?: string | null;
          created_at?: string; updated_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string; user_id: string; nom: string; prenom: string;
          email: string | null; telephone: string; adresse: string | null;
          notes: string | null; total_depense: number; nb_factures: number;
          derniere_visite: string | null; date_naissance: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; user_id: string; nom: string; prenom: string;
          email?: string | null; telephone: string; adresse?: string | null;
          notes?: string | null; total_depense?: number; nb_factures?: number;
          derniere_visite?: string | null; date_naissance?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; user_id?: string; nom?: string; prenom?: string;
          email?: string | null; telephone?: string; adresse?: string | null;
          notes?: string | null; total_depense?: number; nb_factures?: number;
          derniere_visite?: string | null; date_naissance?: string | null;
          created_at?: string; updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string; user_id: string; nom: string; description: string | null;
          type: "service" | "article"; prix_ht: number; prix_ttc: number; tva: number;
          categorie: string; actif: boolean; stock_id: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; user_id: string; nom: string; description?: string | null;
          type: "service" | "article"; prix_ht: number; prix_ttc: number; tva: number;
          categorie: string; actif?: boolean; stock_id?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; user_id?: string; nom?: string; description?: string | null;
          type?: "service" | "article"; prix_ht?: number; prix_ttc?: number; tva?: number;
          categorie?: string; actif?: boolean; stock_id?: string | null;
          created_at?: string; updated_at?: string;
        };
        Relationships: [];
      };
      factures: {
        Row: {
          id: string; user_id: string; client_id: string | null; numero: string;
          statut: "brouillon" | "envoyee" | "payee" | "en_retard" | "partielle";
          date_emission: string; date_echeance: string; date_paiement: string | null;
          sous_total: number; montant_tva: number; total_ttc: number; montant_paye: number | null;
          notes: string | null; conditions: string | null;
          mode_paiement: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; user_id: string; client_id?: string | null; numero: string;
          statut?: "brouillon" | "envoyee" | "payee" | "en_retard" | "partielle";
          date_emission: string; date_echeance: string; date_paiement?: string | null;
          sous_total: number; montant_tva: number; total_ttc: number; montant_paye?: number | null;
          notes?: string | null; conditions?: string | null;
          mode_paiement?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; user_id?: string; client_id?: string | null; numero?: string;
          statut?: "brouillon" | "envoyee" | "payee" | "en_retard" | "partielle";
          date_emission?: string; date_echeance?: string; date_paiement?: string | null;
          sous_total?: number; montant_tva?: number; total_ttc?: number; montant_paye?: number | null;
          notes?: string | null; conditions?: string | null;
          mode_paiement?: string | null;
          created_at?: string; updated_at?: string;
        };
        Relationships: [];
      };
      agents: {
        Row: { id: string; user_id: string; nom: string; actif: boolean; created_at: string; };
        Insert: { id?: string; user_id: string; nom: string; actif?: boolean; created_at?: string; };
        Update: { id?: string; user_id?: string; nom?: string; actif?: boolean; created_at?: string; };
        Relationships: [];
      };
      mouvements_stock: {
        Row: {
          id: string; user_id: string; stock_id: string | null; article_nom: string;
          type: "entree" | "sortie"; quantite: number; prix_unitaire: number;
          date: string; notes: string | null; facture_id: string | null;
        };
        Insert: {
          id?: string; user_id: string; stock_id?: string | null; article_nom: string;
          type: "entree" | "sortie"; quantite: number; prix_unitaire?: number;
          date?: string; notes?: string | null; facture_id?: string | null;
        };
        Update: {
          id?: string; user_id?: string; stock_id?: string | null; article_nom?: string;
          type?: "entree" | "sortie"; quantite?: number; prix_unitaire?: number;
          date?: string; notes?: string | null; facture_id?: string | null;
        };
        Relationships: [];
      };
      lignes_facture: {
        Row: {
          id: string; facture_id: string; service_id: string | null;
          designation: string; quantite: number; prix_unitaire_ht: number;
          tva: number; total_ht: number; total_ttc: number; ordre: number;
          agent_id: string | null;
        };
        Insert: {
          id?: string; facture_id: string; service_id?: string | null;
          designation: string; quantite: number; prix_unitaire_ht: number;
          tva: number; total_ht: number; total_ttc: number; ordre: number;
          agent_id?: string | null;
        };
        Update: {
          id?: string; facture_id?: string; service_id?: string | null;
          designation?: string; quantite?: number; prix_unitaire_ht?: number;
          tva?: number; total_ht?: number; total_ttc?: number; ordre?: number;
          agent_id?: string | null;
        };
        Relationships: [];
      };
      stock: {
        Row: {
          id: string; user_id: string; nom: string; reference: string | null;
          categorie: string; quantite: number;
          unite: string;
          seuil_alerte: number; prix_achat: number; fournisseur: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; user_id: string; nom: string; reference?: string | null;
          categorie: string; quantite: number;
          unite: string;
          seuil_alerte: number; prix_achat: number; fournisseur?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; user_id?: string; nom?: string; reference?: string | null;
          categorie?: string; quantite?: number;
          unite?: string;
          seuil_alerte?: number; prix_achat?: number; fournisseur?: string | null;
          created_at?: string; updated_at?: string;
        };
        Relationships: [];
      };
      rendez_vous: {
        Row: {
          id: string; user_id: string; client_id: string | null;
          date: string; heure_debut: string; heure_fin: string;
          statut: string;
          montant_estime: number; notes: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; user_id: string; client_id?: string | null;
          date: string; heure_debut: string; heure_fin: string;
          statut?: string;
          montant_estime?: number; notes?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; user_id?: string; client_id?: string | null;
          date?: string; heure_debut?: string; heure_fin?: string;
          statut?: string;
          montant_estime?: number; notes?: string | null;
          created_at?: string; updated_at?: string;
        };
        Relationships: [];
      };
      rendez_vous_services: {
        Row: { rendez_vous_id: string; service_id: string };
        Insert: { rendez_vous_id: string; service_id: string };
        Update: { rendez_vous_id?: string; service_id?: string };
        Relationships: [];
      };
      charges: {
        Row: {
          id: string; user_id: string; libelle: string;
          type: string;
          montant: number; mois: number; annee: number;
          description: string | null; employe: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; user_id: string; libelle: string;
          type: string;
          montant: number; mois: number; annee: number;
          description?: string | null; employe?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; user_id?: string; libelle?: string;
          type?: string;
          montant?: number; mois?: number; annee?: number;
          description?: string | null; employe?: string | null;
          created_at?: string; updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
