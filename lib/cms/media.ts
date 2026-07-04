// Client-safe media helpers (no server-only imports). The pipeline stores 3
// pre-generated webp widths per image; next/image uses `mediaLoader` so it serves
// those files directly (no Vercel re-optimization).

export const MEDIA_SIZES = [400, 800, 1200] as const;

export type MediaRow = {
  alan: string;
  storage_path: string; // base path, e.g. "usta/<uuid>" (files: <base>-400.webp …)
  oran: string | null;
  genislik: number | null;
  yukseklik: number | null;
};

const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-media`;

/** Public URL of one pre-generated size. */
export function mediaSizeUrl(base: string, width: number): string {
  return `${STORAGE_BASE}/${base}-${width}.webp`;
}

/** next/image loader → nearest pre-generated size for the requested width. */
export function mediaLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  const size = width <= 400 ? 400 : width <= 800 ? 800 : 1200;
  return mediaSizeUrl(src, size);
}

/** <Image> props for a `fill` image: media (via loader) or a fallback path. */
export function mediaFill(media: MediaRow | null, fallbackSrc: string) {
  return media
    ? { src: media.storage_path, loader: mediaLoader }
    : { src: fallbackSrc };
}

/** <Image> props for a fixed width/height image: media or a fallback. */
export function mediaFixed(
  media: MediaRow | null,
  fallback: { src: string; width: number; height: number }
) {
  return media
    ? {
        loader: mediaLoader,
        src: media.storage_path,
        width: media.genislik ?? 1200,
        height: media.yukseklik ?? 1200,
      }
    : fallback;
}
