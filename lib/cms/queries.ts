import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { CONTENT_DEFAULTS } from "./content";
import { unpackTr } from "./value";

/**
 * Full content map for the public site: hardcoded defaults with any saved DB
 * values layered on top. Every key is always present (fallback), so the site
 * never shows a blank for an unset key.
 *
 * Caching is handled at the page level via ISR (`export const revalidate` on the
 * homepage); the CMS save action calls revalidatePath("/") to push edits live
 * immediately. Uses the admin client (no cookies → cacheable; no PII in
 * site_content).
 */
export async function getSiteContent(): Promise<Record<string, string>> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_content").select("key, value");

  const db: Record<string, string> = {};
  for (const row of data ?? []) {
    const tr = unpackTr(row.value as string | null);
    if (tr != null) db[row.key] = tr;
  }
  return { ...CONTENT_DEFAULTS, ...db };
}
