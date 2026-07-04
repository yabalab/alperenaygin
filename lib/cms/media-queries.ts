import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MediaRow } from "./media";

/**
 * Latest media row per `alan`. Public (no PII); uses the admin client so it's
 * cookieless/cacheable. Site falls back to hardcoded images when an alan is
 * absent. Cache handled by page-level ISR + revalidatePath("/") on upload.
 */
export async function getSiteMedia(): Promise<Record<string, MediaRow>> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("media")
    .select("alan, storage_path, oran, genislik, yukseklik")
    .order("created_at", { ascending: false });

  const out: Record<string, MediaRow> = {};
  for (const row of data ?? []) {
    if (row.alan && !out[row.alan]) out[row.alan] = row as MediaRow;
  }
  return out;
}
