-- ============================================================================
-- instagram_posts — reshape for the CMS manual-add turn.
--
-- Same inline approach as before_after: store each post's image inline (Storage
-- base path + dimensions) instead of a media(id) FK, reusing the singles image
-- pipeline (sharp -> 3 webp sizes in the `site-media` bucket). `link` holds the
-- Instagram post permalink; `sira`/`aktif` drive order + soft-hide.
--
-- Safe to run: the stub is empty (this turn first populates it).
-- ============================================================================

alter table public.instagram_posts
  drop column if exists media_id,
  add  column if not exists gorsel_path  text,   -- Storage base, e.g. 'ig/<uuid>'
  add  column if not exists gorsel_w     integer,
  add  column if not exists gorsel_h     integer;

create index if not exists idx_instagram_posts_sira on public.instagram_posts (sira);
