-- ============================================================================
-- before_after — reshape for the CMS list turn.
--
-- The initial schema stubbed this table with media(id) FKs. We instead store
-- each card's two cropped images INLINE (Storage base paths + dimensions),
-- reusing the exact singles image pipeline (sharp -> 3 webp sizes in the
-- `site-media` bucket). This keeps the working per-`alan` media engine
-- untouched and makes the carousel query a single flat read (no join).
--
-- Safe to run: the stub is empty (this turn is what first populates it).
-- ============================================================================

alter table public.before_after
  drop column if exists oncesi_media_id,
  drop column if exists sonrasi_media_id,
  add  column if not exists oncesi_path   text,   -- Storage base, e.g. 'ba/<uuid>-oncesi'
  add  column if not exists oncesi_w      integer,
  add  column if not exists oncesi_h      integer,
  add  column if not exists sonrasi_path  text,   -- Storage base, e.g. 'ba/<uuid>-sonrasi'
  add  column if not exists sonrasi_w     integer,
  add  column if not exists sonrasi_h     integer;

-- `yas` stays text (optional, may be blank/null); `sure` already text.
-- Ordering for the carousel + admin list.
create index if not exists idx_before_after_sira on public.before_after (sira);
