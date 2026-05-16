-- ============================================================
-- SALON FACTURE — Schéma Supabase complet
-- À exécuter dans l'éditeur SQL de votre projet Supabase
-- ============================================================

-- ── Extensions ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Entreprises ─────────────────────────────────────────────
create table if not exists public.entreprises (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null unique,
  nom         text not null,
  adresse     text not null default '',
  telephone   text not null default '',
  email       text not null default '',
  site_web    text,
  logo        text,
  couleur_principale text default '#8B5CF6',
  siret       text,
  numero_tva  text,
  rib         text,
  mentions_legales text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- ── Clients ─────────────────────────────────────────────────
create table if not exists public.clients (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  nom             text not null,
  prenom          text not null,
  email           text,
  telephone       text not null,
  adresse         text,
  notes           text,
  date_naissance  date,
  total_depense   integer not null default 0,
  nb_factures     integer not null default 0,
  derniere_visite date,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

-- ── Services / Articles ──────────────────────────────────────
create table if not exists public.services (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  nom         text not null,
  description text,
  type        text not null check (type in ('service', 'article')),
  prix_ht     integer not null default 0,
  prix_ttc    integer not null default 0,
  tva         integer not null default 18,
  categorie   text not null,
  actif       boolean not null default true,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- ── Factures ────────────────────────────────────────────────
create table if not exists public.factures (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  client_id       uuid references public.clients(id) on delete set null,
  numero          text not null,
  statut          text not null default 'brouillon'
                    check (statut in ('brouillon', 'envoyee', 'payee', 'en_retard')),
  date_emission   date not null,
  date_echeance   date not null,
  date_paiement   date,
  sous_total      integer not null default 0,
  montant_tva     integer not null default 0,
  total_ttc       integer not null default 0,
  notes           text,
  conditions      text,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null,
  unique(user_id, numero)
);

-- ── Lignes de facture ────────────────────────────────────────
create table if not exists public.lignes_facture (
  id                  uuid primary key default uuid_generate_v4(),
  facture_id          uuid references public.factures(id) on delete cascade not null,
  service_id          uuid references public.services(id) on delete set null,
  designation         text not null,
  quantite            integer not null default 1,
  prix_unitaire_ht    integer not null default 0,
  tva                 integer not null default 18,
  total_ht            integer not null default 0,
  total_ttc           integer not null default 0,
  ordre               integer not null default 0
);

-- ── Stock ────────────────────────────────────────────────────
create table if not exists public.stock (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  nom           text not null,
  reference     text,
  categorie     text not null,
  quantite      integer not null default 0,
  unite         text not null default 'unité'
                  check (unite in ('unité', 'litre', 'kg', 'flacon', 'boîte')),
  seuil_alerte  integer not null default 3,
  prix_achat    integer not null default 0,
  fournisseur   text,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);

-- ── Rendez-vous ──────────────────────────────────────────────
create table if not exists public.rendez_vous (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  client_id       uuid references public.clients(id) on delete set null,
  date            date not null,
  heure_debut     time not null,
  heure_fin       time not null,
  statut          text not null default 'en_attente'
                    check (statut in ('confirme', 'en_attente', 'annule', 'termine')),
  montant_estime  integer not null default 0,
  notes           text,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

-- ── Rendez-vous ↔ Services (liaison) ─────────────────────────
create table if not exists public.rendez_vous_services (
  rendez_vous_id  uuid references public.rendez_vous(id) on delete cascade not null,
  service_id      uuid references public.services(id) on delete cascade not null,
  primary key (rendez_vous_id, service_id)
);

-- ── Charges ──────────────────────────────────────────────────
create table if not exists public.charges (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  libelle     text not null,
  type        text not null check (type in ('salaire', 'loyer', 'fourniture', 'maintenance', 'autre')),
  montant     integer not null default 0,
  mois        integer not null check (mois between 1 and 12),
  annee       integer not null,
  description text,
  employe     text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- ============================================================
-- Triggers updated_at automatique
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_entreprises_updated_at before update on public.entreprises for each row execute function public.handle_updated_at();
create trigger trg_clients_updated_at     before update on public.clients     for each row execute function public.handle_updated_at();
create trigger trg_services_updated_at    before update on public.services    for each row execute function public.handle_updated_at();
create trigger trg_factures_updated_at    before update on public.factures    for each row execute function public.handle_updated_at();
create trigger trg_stock_updated_at       before update on public.stock       for each row execute function public.handle_updated_at();
create trigger trg_rendez_vous_updated_at before update on public.rendez_vous for each row execute function public.handle_updated_at();
create trigger trg_charges_updated_at     before update on public.charges     for each row execute function public.handle_updated_at();

-- ============================================================
-- Trigger : créer l'entreprise par défaut à l'inscription
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.entreprises (user_id, nom, adresse, telephone, email)
  values (new.id, 'Mon Salon', '', '', coalesce(new.email, ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- RLS (Row Level Security) — chaque utilisateur ne voit
-- que SES propres données
-- ============================================================
alter table public.entreprises   enable row level security;
alter table public.clients       enable row level security;
alter table public.services      enable row level security;
alter table public.factures      enable row level security;
alter table public.lignes_facture enable row level security;
alter table public.stock         enable row level security;
alter table public.rendez_vous   enable row level security;
alter table public.rendez_vous_services enable row level security;
alter table public.charges       enable row level security;

-- Entreprises
create policy "Entreprise: lecture propriétaire"   on public.entreprises for select using (auth.uid() = user_id);
create policy "Entreprise: modif propriétaire"     on public.entreprises for update using (auth.uid() = user_id);
create policy "Entreprise: insertion propriétaire" on public.entreprises for insert with check (auth.uid() = user_id);

-- Clients
create policy "Clients: lecture"   on public.clients for select using (auth.uid() = user_id);
create policy "Clients: insertion" on public.clients for insert with check (auth.uid() = user_id);
create policy "Clients: modif"     on public.clients for update using (auth.uid() = user_id);
create policy "Clients: suppression" on public.clients for delete using (auth.uid() = user_id);

-- Services
create policy "Services: lecture"   on public.services for select using (auth.uid() = user_id);
create policy "Services: insertion" on public.services for insert with check (auth.uid() = user_id);
create policy "Services: modif"     on public.services for update using (auth.uid() = user_id);
create policy "Services: suppression" on public.services for delete using (auth.uid() = user_id);

-- Factures
create policy "Factures: lecture"   on public.factures for select using (auth.uid() = user_id);
create policy "Factures: insertion" on public.factures for insert with check (auth.uid() = user_id);
create policy "Factures: modif"     on public.factures for update using (auth.uid() = user_id);
create policy "Factures: suppression" on public.factures for delete using (auth.uid() = user_id);

-- Lignes facture (accès via la facture parente)
create policy "Lignes: lecture"   on public.lignes_facture for select
  using (exists (select 1 from public.factures f where f.id = facture_id and f.user_id = auth.uid()));
create policy "Lignes: insertion" on public.lignes_facture for insert
  with check (exists (select 1 from public.factures f where f.id = facture_id and f.user_id = auth.uid()));
create policy "Lignes: modif"     on public.lignes_facture for update
  using (exists (select 1 from public.factures f where f.id = facture_id and f.user_id = auth.uid()));
create policy "Lignes: suppression" on public.lignes_facture for delete
  using (exists (select 1 from public.factures f where f.id = facture_id and f.user_id = auth.uid()));

-- Stock
create policy "Stock: lecture"   on public.stock for select using (auth.uid() = user_id);
create policy "Stock: insertion" on public.stock for insert with check (auth.uid() = user_id);
create policy "Stock: modif"     on public.stock for update using (auth.uid() = user_id);
create policy "Stock: suppression" on public.stock for delete using (auth.uid() = user_id);

-- Rendez-vous
create policy "RDV: lecture"   on public.rendez_vous for select using (auth.uid() = user_id);
create policy "RDV: insertion" on public.rendez_vous for insert with check (auth.uid() = user_id);
create policy "RDV: modif"     on public.rendez_vous for update using (auth.uid() = user_id);
create policy "RDV: suppression" on public.rendez_vous for delete using (auth.uid() = user_id);

-- Rendez-vous services
create policy "RDV services: lecture" on public.rendez_vous_services for select
  using (exists (select 1 from public.rendez_vous r where r.id = rendez_vous_id and r.user_id = auth.uid()));
create policy "RDV services: insertion" on public.rendez_vous_services for insert
  with check (exists (select 1 from public.rendez_vous r where r.id = rendez_vous_id and r.user_id = auth.uid()));
create policy "RDV services: suppression" on public.rendez_vous_services for delete
  using (exists (select 1 from public.rendez_vous r where r.id = rendez_vous_id and r.user_id = auth.uid()));

-- Charges
create policy "Charges: lecture"   on public.charges for select using (auth.uid() = user_id);
create policy "Charges: insertion" on public.charges for insert with check (auth.uid() = user_id);
create policy "Charges: modif"     on public.charges for update using (auth.uid() = user_id);
create policy "Charges: suppression" on public.charges for delete using (auth.uid() = user_id);

-- ============================================================
-- Indexes pour les performances
-- ============================================================
create index idx_clients_user_id       on public.clients(user_id);
create index idx_factures_user_id      on public.factures(user_id);
create index idx_factures_client_id    on public.factures(client_id);
create index idx_factures_statut       on public.factures(statut);
create index idx_lignes_facture_id     on public.lignes_facture(facture_id);
create index idx_services_user_id      on public.services(user_id);
create index idx_stock_user_id         on public.stock(user_id);
create index idx_rdv_user_id           on public.rendez_vous(user_id);
create index idx_rdv_date              on public.rendez_vous(date);
create index idx_charges_user_id       on public.charges(user_id);
create index idx_charges_mois_annee    on public.charges(user_id, mois, annee);

-- ============================================================
-- Storage — Bucket logos
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('logos', 'logos', true)
  on conflict (id) do nothing;

create policy "logos: lecture publique"
  on storage.objects for select using (bucket_id = 'logos');

create policy "logos: upload propriétaire"
  on storage.objects for insert
  with check (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "logos: update propriétaire"
  on storage.objects for update
  using (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "logos: delete propriétaire"
  on storage.objects for delete
  using (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);
