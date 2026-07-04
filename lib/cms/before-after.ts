import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildCaption, type ProofItem } from "@/lib/proof-items";

/** One before/after card. Images stored inline as Storage base paths. */
export type BeforeAfterRow = {
  id: string;
  isim: string | null;
  yas: string | null;
  sure: string | null;
  sira: number | null;
  aktif: boolean;
  oncesi_path: string | null;
  oncesi_w: number | null;
  oncesi_h: number | null;
  sonrasi_path: string | null;
  sonrasi_w: number | null;
  sonrasi_h: number | null;
};

const COLS =
  "id, isim, yas, sure, sira, aktif, oncesi_path, oncesi_w, oncesi_h, sonrasi_path, sonrasi_w, sonrasi_h";

// Public read via the admin client: no PII, cookieless/cacheable. Freshness is
// handled by page-level ISR + revalidatePath("/") on every admin write.

/** Active cards for the public carousel, in display order. */
export async function getBeforeAfter(): Promise<BeforeAfterRow[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("before_after")
    .select(COLS)
    .eq("aktif", true)
    .order("sira", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  return (data ?? []) as BeforeAfterRow[];
}

/** All cards (active + passive) for the admin manager, in display order. */
export async function getAllBeforeAfter(): Promise<BeforeAfterRow[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("before_after")
    .select(COLS)
    .order("sira", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  return (data ?? []) as BeforeAfterRow[];
}

/**
 * Map DB rows to the carousel's ProofItem shape. `remote: true` tells ProofCard
 * to serve the images through `mediaLoader` (pre-sized webp, no re-optimization).
 * Rows missing an image are skipped (defensive — shouldn't happen).
 */
export function toProofItems(rows: BeforeAfterRow[]): ProofItem[] {
  return rows
    .filter((r) => r.oncesi_path && r.sonrasi_path)
    .map((r) => {
      const name = (r.isim ?? "").trim();
      return {
        before: r.oncesi_path as string,
        after: r.sonrasi_path as string,
        beforeAlt: name ? `${name} — uygulama öncesi` : "Uygulama öncesi",
        afterAlt: name ? `${name} — uygulama sonrası` : "Uygulama sonrası",
        caption: buildCaption(r.isim, r.yas, r.sure),
        remote: true,
      };
    });
}
