-- ============================================================================
-- Alperen Aygın Hair Studio — initial schema
-- Postgres / Supabase. All tables in `public`, all with RLS enabled.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.appointment_status as enum
  ('bekliyor', 'onaylandi', 'tamamlandi', 'iptal', 'gelmedi');

create type public.appointment_source as enum
  ('site', 'manuel');

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- media  (records of images stored in Supabase Storage)
--   referenced by before_after and instagram_posts, so created first.
-- ---------------------------------------------------------------------------
create table public.media (
  id            uuid primary key default gen_random_uuid(),
  storage_path  text not null,
  alan          text,                 -- hero / model / atolye / before / instagram
  oran          text,                 -- e.g. '3:2'
  genislik      integer,
  yukseklik     integer,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
create table public.customers (
  id             uuid primary key default gen_random_uuid(),
  ad             text not null,
  telefon        text not null unique,        -- unique => also an index
  kampanya_izni  boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- appointments
--   saat kept as text 'HH:MM' to match the front-end hourly slots.
-- ---------------------------------------------------------------------------
create table public.appointments (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.customers(id) on delete cascade,
  tarih        date not null,
  saat         text not null,                 -- 'HH:MM'
  durum        public.appointment_status not null default 'bekliyor',
  kaynak       public.appointment_source not null default 'site',
  not_metni    text,                          -- renamed from "not" (reserved word)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- notes  (free notes + customer/appointment history)
-- ---------------------------------------------------------------------------
create table public.notes (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid not null references public.customers(id) on delete cascade,
  appointment_id  uuid references public.appointments(id) on delete set null,
  icerik          text not null,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- blocked_slots  (availability = confirmed appointments + these blocks)
--   saat null => whole day closed.
-- ---------------------------------------------------------------------------
create table public.blocked_slots (
  id          uuid primary key default gen_random_uuid(),
  tarih       date not null,
  saat        text,                            -- null = tüm gün kapalı
  sebep       text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- site_content  (CMS single strings: hero_title, usta_paragraf, ...)
-- ---------------------------------------------------------------------------
create table public.site_content (
  key         text primary key,
  value       text,
  grup        text,                            -- which section
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- before_after
-- ---------------------------------------------------------------------------
create table public.before_after (
  id                uuid primary key default gen_random_uuid(),
  oncesi_media_id   uuid references public.media(id) on delete set null,
  sonrasi_media_id  uuid references public.media(id) on delete set null,
  isim              text,
  yas               text,
  sure              text,
  sira              integer,
  aktif             boolean not null default true,
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- instagram_posts
-- ---------------------------------------------------------------------------
create table public.instagram_posts (
  id          uuid primary key default gen_random_uuid(),
  media_id    uuid references public.media(id) on delete set null,
  link        text,
  sira        integer,
  aktif       boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes (frequently queried columns)
-- ---------------------------------------------------------------------------
create index idx_appointments_tarih        on public.appointments (tarih);
create index idx_appointments_customer_id  on public.appointments (customer_id);
create index idx_appointments_durum        on public.appointments (durum);
create index idx_blocked_slots_tarih       on public.blocked_slots (tarih);
-- customers(telefon) index is provided by the UNIQUE constraint above.

-- ---------------------------------------------------------------------------
-- updated_at triggers (only tables that have updated_at)
-- ---------------------------------------------------------------------------
create trigger trg_customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

create trigger trg_appointments_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

create trigger trg_site_content_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.media            enable row level security;
alter table public.customers        enable row level security;
alter table public.appointments     enable row level security;
alter table public.notes            enable row level security;
alter table public.blocked_slots    enable row level security;
alter table public.site_content     enable row level security;
alter table public.before_after     enable row level security;
alter table public.instagram_posts  enable row level security;

-- --- Public-read content tables ---------------------------------------------
-- anon + authenticated may SELECT (the public site renders these).
-- Only authenticated (admin) may write.

-- media
create policy "media_public_read" on public.media
  for select to anon, authenticated using (true);
create policy "media_admin_write" on public.media
  for all to authenticated using (true) with check (true);

-- site_content
create policy "site_content_public_read" on public.site_content
  for select to anon, authenticated using (true);
create policy "site_content_admin_write" on public.site_content
  for all to authenticated using (true) with check (true);

-- before_after
create policy "before_after_public_read" on public.before_after
  for select to anon, authenticated using (true);
create policy "before_after_admin_write" on public.before_after
  for all to authenticated using (true) with check (true);

-- instagram_posts
create policy "instagram_posts_public_read" on public.instagram_posts
  for select to anon, authenticated using (true);
create policy "instagram_posts_admin_write" on public.instagram_posts
  for all to authenticated using (true) with check (true);

-- --- Private data tables -----------------------------------------------------
-- authenticated (admin) has full access. anon has NO read/update/delete.

-- customers: admin all; anon may INSERT only (new customer from the form).
create policy "customers_admin_all" on public.customers
  for all to authenticated using (true) with check (true);
create policy "customers_anon_insert" on public.customers
  for insert to anon with check (true);

-- appointments: admin all; anon may INSERT only (booking from the site).
create policy "appointments_admin_all" on public.appointments
  for all to authenticated using (true) with check (true);
create policy "appointments_anon_insert" on public.appointments
  for insert to anon with check (true);

-- notes: admin only, no anon access at all.
create policy "notes_admin_all" on public.notes
  for all to authenticated using (true) with check (true);

-- blocked_slots: admin only, no anon access at all.
create policy "blocked_slots_admin_all" on public.blocked_slots
  for all to authenticated using (true) with check (true);
