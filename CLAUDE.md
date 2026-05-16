# Salon Facture — Guide Claude Code

Application SaaS de facturation pour salons de coiffure africains (marché Sénégal/Afrique de l'Ouest).
Devise : FCFA. TVA : 18%. Langue : français.

## Stack

- **Next.js 14** App Router — Server Components par défaut, Client Components pour l'interactivité
- **Supabase** (`@supabase/ssr` v0.5.2 + `@supabase/supabase-js`) — auth, base de données, RLS
- **TypeScript**, **Tailwind CSS**, **shadcn/ui** (Radix UI)
- **Playwright** pour les tests E2E
- Déployé sur **Vercel**

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
  (auth)/connexion/     # page de connexion/inscription
  (public)/landing/     # landing page publique
  (dashboard)/          # pages protégées (layout avec Sidebar + Header)
components/
  clients/              # ClientsClient.tsx
  factures/             # NouvelleFactureForm.tsx, FacturesClient.tsx, FactureDetail.tsx
  rendez-vous/          # RendezVousClient.tsx
  services/             # ServicesClient.tsx
  stock/                # StockClient.tsx
  charges/              # ChargesClient.tsx
  layout/               # Sidebar.tsx, Header.tsx
lib/
  actions/              # Server Actions (auth, clients, factures, services, stock, charges, rendez-vous)
  supabase/             # server.ts, middleware.ts
  utils/formatters.ts   # formatFCFA, formatDate, calculerTTC, TVA_TAUX=18
types/
  supabase.ts           # types Database manuels (voir note critique ci-dessous)
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

Utiliser `{ [_ in never]: never }` et non `Record<string, never>` pour Views/Functions/Enums dans `types/supabase.ts`. `Record<string, never>` détruit l'inférence des tables via l'intersection interne de postgrest-js.

### cookiesToSet — type explicite requis

```ts
setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[])
```

## Middleware

- Routes publiques : `/landing`, `/connexion`
- Toutes les autres routes → redirigent vers `/landing` si non authentifié
- Utilisateurs authentifiés sur routes publiques → redirigent vers `/`

## Base de données Supabase

**Projet** : `oetfebawodcgmrwlkhgx`
**URL** : `https://oetfebawodcgmrwlkhgx.supabase.co`

### Tables

- `entreprises` — 1 par user, créée automatiquement à l'inscription via trigger `on_auth_user_created`
- `clients` — champs : nom, prenom, telephone, email, adresse, notes, date_naissance, total_depense, nb_factures, derniere_visite
- `services` — type: 'service' | 'article', stock_id (FK vers stock, nullable) — lien stock pour mouvement automatique
- `factures` — statuts: brouillon / envoyee / payee / en_retard
- `lignes_facture` — lignes d'une facture
- `stock` — quantite, seuil_alerte (badge alerte si quantite <= seuil)
- `rendez_vous` — statuts: en_attente / confirme / annule / termine
- `rendez_vous_services` — table de liaison
- `charges` — types: salaire / loyer / fourniture / maintenance / autre

### RLS

Chaque table a RLS activé. Chaque utilisateur ne voit que ses propres données (`auth.uid() = user_id`).

### Migrations effectuées (après création initiale)

```sql
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS date_naissance date;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS stock_id uuid REFERENCES public.stock(id) ON DELETE SET NULL;
```

## Fonctionnalités implémentées

### Dashboard
- Statistiques : total factures, montant encaissé, clients, RDV à venir
- Alertes stock (produits sous le seuil)

### Clients
- CRUD complet avec modal
- Champ date de naissance (icône gâteau sur la carte)
- Recherche par nom / téléphone / email

### Factures
- Création avec lignes (service ou article)
- **Mouvement de stock automatique** : si une ligne utilise un article lié à un stock_id, la quantité est décrémentée à la création de la facture
- Changement de statut (brouillon → envoyée → payée)
- Génération numéro automatique (FAC-YYYY-XXXX)

### Services/Articles
- Liaison optionnelle article ↔ stock via `stock_id`
- Le stock lié s'affiche dans le sélecteur (nom + quantité actuelle)

### Stock
- CRUD avec alertes visuelles
- Décrémentation automatique à la facturation

### Rendez-vous
- **Rappels du jour** : bannière orange en haut de page avec les RDV d'aujourd'hui et demain non annulés/terminés
- Filtres : Aujourd'hui / À venir / Tous
- Confirmation / annulation rapide

### Facture — nouvelle
- **Combobox de recherche** pour service/article : champ texte avec dropdown filtré, séparé en sections "Services" / "Articles"

### Landing page (`/landing`)
- Hero, features, pricing (0 FCFA gratuit / 9 900 FCFA Pro), testimonials, footer
- Statiquement pré-rendue

## Tests E2E (Playwright)

```bash
npm run test:public     # landing.spec.ts + auth.spec.ts (sans credentials)
npm run test:ui         # interface graphique Playwright
npm run test:report     # rapport HTML
```

- `tests/e2e/landing.spec.ts` — 8 tests, tous passent
- `tests/e2e/auth.spec.ts` — 6 tests publics passent, 2 skippés (nécessitent TEST_EMAIL/TEST_PASSWORD)
- `tests/e2e/middleware.spec.ts` — protection des routes
- `tests/e2e/app.spec.ts` — tests authentifiés (nécessitent storageState)
- `tests/e2e/setup/auth.setup.ts` — génère `playwright/.auth/user.json`

Pour les tests authentifiés, créer `.env.local` avec :
```
TEST_EMAIL=...
TEST_PASSWORD=...
```

## Variables d'environnement

`.env.local` (jamais committer) :
```
NEXT_PUBLIC_SUPABASE_URL=https://oetfebawodcgmrwlkhgx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
TEST_EMAIL=...          # optionnel, pour tests E2E authentifiés
TEST_PASSWORD=...       # optionnel, pour tests E2E authentifiés
```

## Conventions

- Montants en **centimes entiers** (integer) dans la DB, formatés avec `formatFCFA()` à l'affichage
- Dates au format `YYYY-MM-DD` (type `date` en SQL)
- Les Server Actions retournent `{ error: string }` ou `{ success: true }` (jamais throw)
- Les composants `*Client.tsx` sont des Client Components (`"use client"`) qui reçoivent les données initiales via props depuis le Server Component parent
- `useTransition` pour toutes les mutations (non-bloquant)
- `window.location.reload()` après création (pour récupérer l'ID généré par Supabase) — les updates sont optimistes

## Pièges connus

- `Radix UI Select` : `<SelectItem value="">` interdit — utiliser `value="none"` et traiter comme null
- `getByLabel()` dans Playwright nécessite `htmlFor` sur `<Label>` et `id` sur `<Input>` correspondant
- `getByText()` en Playwright est case-insensitive et fait du substring matching → utiliser `{ exact: true }` ou `getByRole('heading', { name, level: 3 })` pour éviter les violations strict mode
- `useTransition` vient de `"react"`, pas de `"next/navigation"`
- Les callbacks `startTransition` doivent retourner `void` → wrapper en `async () => { await fn(); }`
