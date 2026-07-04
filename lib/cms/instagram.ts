import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { INSTAGRAM_URL, type InstagramPost } from "@/lib/instagram";

/** One Instagram band post. Image stored inline as a Storage base path. */
export type InstagramRow = {
  id: string;
  link: string | null;
  sira: number | null;
  aktif: boolean;
  gorsel_path: string | null;
  gorsel_w: number | null;
  gorsel_h: number | null;
};

const COLS = "id, link, sira, aktif, gorsel_path, gorsel_w, gorsel_h";

// Public read via the admin client: no PII, cookieless/cacheable. Freshness is
// handled by page-level ISR + revalidatePath("/") on every admin write.

/** Active posts for the public band, in display order. */
export async function getInstagram(): Promise<InstagramRow[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("instagram_posts")
    .select(COLS)
    .eq("aktif", true)
    .order("sira", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  return (data ?? []) as InstagramRow[];
}

/** All posts (active + passive) for the admin manager, in display order. */
export async function getAllInstagram(): Promise<InstagramRow[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("instagram_posts")
    .select(COLS)
    .order("sira", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  return (data ?? []) as InstagramRow[];
}

/**
 * Map DB rows to the band's InstagramPost shape. `remote: true` tells the band
 * to serve images through `mediaLoader` (pre-sized webp, no re-optimization).
 * Rows missing an image are skipped (defensive).
 */
export function toInstagramItems(rows: InstagramRow[]): InstagramPost[] {
  return rows
    .filter((r) => r.gorsel_path)
    .map((r) => ({
      src: r.gorsel_path as string,
      href: (r.link ?? "").trim() || INSTAGRAM_URL,
      alt: "Instagram gönderisi",
      remote: true,
    }));
}
