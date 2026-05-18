# Salon Facture — Guide Claude Code

Application SaaS de facturation pour salons de coiffure africains (marché Sénégal/Afrique de l'Ouest).
Nom commercial : **Walima Techno**. Devise : FCFA. TVA : 18%. Langue : français.
URL de production : **https://dame-beta.vercel.app**

## Stack

- **Next.js 14** App Router — Server Components par défaut, Client Components pour l'interactivité
- **Supabase** (`@supabase/ssr` v0.5.2 + `@supabase/supabase-js`) — auth, base de données, RLS
- **TypeScript**, **Tailwind CSS**, **shadcn/ui** (Radix UI)
- **Playwright** pour les tests E2E
- Déployé sur **Vercel** (projet : `dame`, team : `dame-sady-s-projects`)

## Commandes

```bash
npm run dev          # serveur de développement
npm run build        # build production
npm run test:public  # tests E2E publics (landing + auth)
npm run test         # tous les tests Playwright
```

## Architecture

```
app/
  (auth)/connexion/           # page de connexion/inscription
  (public)/landing/           # landing page publique (redesignée — thème rose/berry beauté)
  (dashboard)/                # pages protégées (layout avec Sidebar + Header)
  prise-rdv/[userId]/         # page publique de réservation (sans auth)
  admin/comptes/              # page admin (accès restreint par ADMIN_EMAIL)
components/
  clients/                    # ClientsClient.tsx
  factures/                   # NouvelleFactureForm.tsx, FacturesClient.tsx, FactureDetail.tsx
  rendez-vous/                # RendezVousClient.tsx, LienReservation.tsx
  services/                   # ServicesClient.tsx
  stock/                      # StockClient.tsx
  charges/                    # ChargesClient.tsx
  membres/                    # MembresClient.tsx (gestion multi-utilisateurs)
  layout/                     # Sidebar.tsx, Header.tsx, LayoutClient.tsx
  parametres/                 # ParametresClient.tsx
lib/
  actions/                    # Server Actions
    auth.ts, clients.ts, factures.ts, services.ts
    stock.ts, charges.ts, rendez-vous.ts, agents.ts
    membres.ts                # CRUD membres_salon (nécessite service role)
    entreprise.ts             # updateEntreprise, uploadLogo, deleteLogo
    admin.ts                  # getComptes, setStatutCompte (admin only)
    rdv-public.ts             # getSalonPublic, creerRdvPublic (sans auth)
  auth/
    context.ts                # getDataContext() — détecte owner vs membre
  supabase/
    server.ts, middleware.ts, service-role.ts
  utils/formatters.ts         # formatFCFA, formatDate, calculerTTC, TVA_TAUX=18
types/
  supabase.ts                 # types Database manuels (voir note critique ci-dessous)
```

## Supabase — Points critiques

### Bug type inference supabase-js 2.105+

Ne pas mettre `<Database>` comme générique sur `createServerClient` dans `lib/supabase/server.ts`.
Cela cause `data: never` sur toutes les requêtes à cause d'un bug interne dans postgrest-js.

```ts
// ✅ Correct — pas de générique
return createServerClient(url, key, { cookies: { ... } });

// ❌ Incorrect — data: never sur toutes les requêtes
return createServerClient<Database>(url, key, { cookies: { ... } });
```

### Types vides dans Database

Utiliser `{ [_ in never]: never }` et non `Record<string, never>` pour Views/Functions/Enums dans `types/supabase.ts`.

### cookiesToSet — type explicite requis

```ts
setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[])
```

## Middleware

- Routes publiques (accessibles sans auth) : `/landing`, `/connexion`, `/auth/`, `/prise-rdv/`, `/abonnement-expire`
- `isAuthOnlyPublic` : `/connexion`, `/landing`, `/auth/` → redirige vers `/` si déjà connecté
- `/prise-rdv/` est public ET accessible même si connecté (ne redirige pas vers dashboard)
- Toutes les autres routes → redirigent vers `/landing` si non authentifié

## Système multi-utilisateurs (membres_salon)

### Concept

Chaque salon a un **propriétaire** (owner) et peut avoir des **membres** (employés avec accès limité).

### Table `membres_salon`

```sql
-- À créer dans Supabase si pas encore fait :
CREATE TABLE public.membres_salon (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  membre_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  nom text NOT NULL,
  role text NOT NULL,
  permissions jsonb,
  actif boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.membres_salon ENABLE ROW LEVEL SECURITY;
```

### `getDataContext()` — lib/auth/context.ts

Fonction centrale appelée par tous les Server Components dashboard. Retourne :
```ts
{ userId, isMembre, permissions, db }
```
- Si `isMembre = true` → `userId` = UUID du propriétaire du salon, `db` = service role client
- Si `isMembre = false` → `userId` = UUID de l'utilisateur connecté
- Fallback si pas de service role key : mode propriétaire uniquement

### Permissions (JSONB)

```ts
type Permissions = {
  factures: boolean;
  clients: boolean;
  rendezVous: boolean;
  services: boolean;
  stock: boolean;
  charges: boolean;
  agents: boolean;
}
```

La Sidebar filtre les items selon `permissions` quand `isMembre = true`.

### Service role key

Toutes les opérations membres nécessitent `SUPABASE_SERVICE_ROLE_KEY` (configurée en `.env.local` et sur Vercel).
Si absente, l'app tourne en mode "propriétaire uniquement" (dégradé gracieux).

## Page de réservation publique — `/prise-rdv/[userId]`

- Accessible sans authentification
- Affiche les infos du salon (logo, nom, couleur principale)
- Layout : 3 colonnes desktop (panneaux décoratifs | formulaire vitré | panneaux)
- Formulaire : prénom, nom, téléphone, date, heure, services (checkboxes sans prix), notes
- Soumission → crée un `rendez_vous` avec `statut = 'en_attente'`
- Le lien de partage est visible dans l'app sous Rendez-vous → `LienReservation.tsx`
- `NEXT_PUBLIC_APP_URL` doit être défini sur Vercel pour que le lien soit correct

### Validation sécurité (rdv-public.ts)

- Validation stricte de tous les champs (longueur, format date/heure)
- Vérification que `userId` correspond à un salon réel
- Vérification que les `serviceIds` appartiennent bien au salon (anti cross-tenant)
- Erreurs Supabase masquées côté client

## Base de données Supabase

**Projet** : `oetfebawodcgmrwlkhgx`
**URL** : `https://oetfebawodcgmrwlkhgx.supabase.co`

### Tables

- `entreprises` — 1 par user, créée via trigger `on_auth_user_created`. Champs clés : `couleur_principale` (hex validé), `logo` (URL Supabase storage), `abonnement_statut`, `trial_ends_at`
- `clients` — nom, prenom, telephone, email, adresse, notes, date_naissance, total_depense, nb_factures, derniere_visite
- `services` — type: 'service' | 'article', categorie, stock_id (FK nullable)
- `factures` — statuts: brouillon / envoyee / payee / en_retard
- `lignes_facture` — lignes d'une facture (pas de user_id direct → filtrer via `factures!inner(user_id)`)
- `stock` — quantite, seuil_alerte, prix_achat
- `rendez_vous` — statuts: en_attente / confirme / annule / termine
- `rendez_vous_services` — table de liaison
- `charges` — types: salaire / loyer / fourniture / maintenance / autre
- `agents` — commerciaux/agents liés aux lignes de facture
- `mouvements_stock` — historique entrées/sorties de stock
- `membres_salon` — utilisateurs membres d'un salon (voir section multi-utilisateurs)

### RLS

Chaque table a RLS activé. Avec service role : toujours filtrer explicitement par `user_id`.
`lignes_facture` n'a pas de `user_id` → filtrer via join : `.select("..., factures!inner(user_id)").eq("factures.user_id", uid)`

### Migrations effectuées

```sql
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS date_naissance date;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS stock_id uuid REFERENCES public.stock(id) ON DELETE SET NULL;
-- membres_salon : voir section multi-utilisateurs ci-dessus
```

## Variables d'environnement

`.env.local` (jamais committer) et Vercel :
```
NEXT_PUBLIC_SUPABASE_URL=https://oetfebawodcgmrwlkhgx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=https://dame-beta.vercel.app   # URL de production pour les liens de partage
SUPABASE_SERVICE_ROLE_KEY=...                       # Requis pour membres_salon et admin
ADMIN_EMAIL=sadynarbi@gmail.com                     # NE PAS hardcoder dans le code
```

## Sécurité — corrections appliquées

- `ADMIN_EMAIL` lu depuis `process.env.ADMIN_EMAIL` (plus jamais hardcodé)
- `couleur_principale` validée comme hex `/^#[0-9A-Fa-f]{6}$/` avant injection CSS
- Upload logo : SVG interdit, extension dérivée du MIME type réel (pas du nom de fichier)
- Endpoint public `creerRdvPublic` : validation stricte + vérification salon + vérification services cross-tenant
- Erreurs Supabase brutes masquées côté client
- CSP : `unsafe-eval` supprimé, img-src restreint aux domaines connus
- Headers de sécurité : HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy

## Fonctionnalités implémentées

### Dashboard
- Statistiques : total factures, montant encaissé, clients, RDV à venir
- Alertes stock (produits sous le seuil)

### Clients
- CRUD complet avec modal
- Champ date de naissance (icône gâteau)
- Recherche par nom / téléphone / email

### Factures
- Création avec lignes (service ou article) + sélection agent par ligne
- Mouvement de stock automatique à la création
- Changement de statut (brouillon → envoyée → payée)
- Numérotation automatique (FAC-YYYY-XXXX)

### Services/Articles
- Liaison optionnelle article ↔ stock via `stock_id`
- Types : 'service' | 'article'

### Stock
- CRUD avec alertes visuelles + champ `prix_achat`
- Décrémentation automatique à la facturation
- Page mouvements de stock avec rapport bénéfices

### Agents
- CRUD agents/commerciaux
- Liaison par ligne de facture

### Rendez-vous
- Rappels du jour (bannière)
- Filtres : Aujourd'hui / À venir / Tous
- Lien de réservation public + QR code + partage WhatsApp

### Paramètres
- Logo du salon (JPG/PNG/WEBP uniquement, max 2Mo)
- Couleur principale (preset + picker)
- Infos entreprise : nom, adresse, téléphone, email, site web, NINEA, numéro TVA, mentions légales
- Gestion des utilisateurs (membres) → lien vers `/parametres/utilisateurs`

### Landing page (`/landing`)
- Design thème beauté : dégradé prune/berry (`#1a0a1e → #8B2255`), fond crème (`#fdf8f5`)
- Hero : texte à gauche + mockup smartphone à droite
- Téléphone CSS réaliste : cadre rose berry, Dynamic Island, carte hero revenus, liste transactions avec avatars, barre nav bas
- Sections : Features, Comment ça marche (fond sombre), Témoignages, Tarifs, Confiance, CTA final

### Page admin (`/admin/comptes`)
- Accès restreint à `ADMIN_EMAIL`
- Voir/modifier le statut d'abonnement des salons (actif / suspendu / trial)

## Conventions

- Montants en **entiers** (FCFA) dans la DB, formatés avec `formatFCFA()` à l'affichage
- Dates au format `YYYY-MM-DD`
- Server Actions retournent `{ error: string }` ou `{ success: true }` (jamais throw)
- Composants `*Client.tsx` : `"use client"`, reçoivent données initiales via props
- `useTransition` pour toutes les mutations
- `window.location.reload()` après création (pour récupérer l'ID Supabase)
- Toutes les actions utilisent `getDataContext()` → `userId` + `db` (service role si dispo)
- Toujours filtrer par `user_id` même avec service role (RLS bypassed)

## Pièges connus

- `Radix UI Select` : `<SelectItem value="">` interdit → utiliser `value="none"`
- `useTransition` vient de `"react"`, pas de `"next/navigation"`
- `lignes_facture` n'a pas de `user_id` → filtrer via join `factures!inner`
- `git add` sur les fichiers avec `[` dans le path → utiliser des guillemets : `git add "app/prise-rdv/[userId]/page.tsx"`
- Service role client bypass RLS → toujours ajouter `.eq("user_id", userId)` manuellement
- `NEXT_PUBLIC_APP_URL` doit être défini sur Vercel (pas seulement en local) pour que le lien de réservation soit correct en production
