"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { MEDIA_SIZES } from "@/lib/cms/media";
import {
  MEDIA_BUCKET,
  MAX_IMAGE_BYTES,
  uploadImageSizes,
  removeImageSizes,
  errMessage,
} from "@/lib/cms/image-pipeline";

export type MediaActionState = { ok: boolean; error: string | null };

// Editable single-image slots. Ratios come from the real site layout.
// (Liste içerikleri — before/after, instagram — sonraki turda.)
const ALLOWED: Record<string, { oran: string }> = {
  usta: { oran: "3:4" }, // Usta portresi
  hero_kel: { oran: "2:3" }, // Hero before/after — öncesi
  hero_sacli: { oran: "2:3" }, // Hero before/after — sonrası (aynı oran → hizalı)
  atolye_lobi: { oran: "16:10" },
  atolye_oda: { oran: "16:10" },
  model_1: { oran: "1:1" },
  model_2: { oran: "1:1" },
  model_3: { oran: "1:1" },
};

/** Remove all size files + media rows for an alan (keeps Storage clean). */
async function purgeAlan(
  supabase: ReturnType<typeof createAdminClient>,
  alan: string
) {
  const { data: rows } = await supabase
    .from("media")
    .select("id, storage_path")
    .eq("alan", alan);
  const paths = (rows ?? []).flatMap((r) =>
    MEDIA_SIZES.map((w) => `${r.storage_path}-${w}.webp`)
  );
  if (paths.length) await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  if (rows?.length) await supabase.from("media").delete().eq("alan", alan);
}

/** Optimize a cropped image to webp sizes, upload, and record it. */
export async function uploadMedia(
  formData: FormData
): Promise<MediaActionState> {
  const alan = String(formData.get("alan") ?? "");
  const spec = ALLOWED[alan];
  if (!spec) return { ok: false, error: "Geçersiz alan." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Görsel bulunamadı." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Görsel çok büyük." };
  }

  const input = Buffer.from(await file.arrayBuffer());

  // Admin (service_role) client — bypasses RLS for the Storage write + DB insert.
  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (e) {
    console.error("[uploadMedia] admin client:", e);
    return {
      ok: false,
      error:
        "Sunucu yapılandırma hatası (SUPABASE_SERVICE_ROLE_KEY eksik/yanlış olabilir).",
    };
  }

  const base = `${alan}/${randomUUID()}`;

  // 1) Storage FIRST — only record in the DB if the files really landed.
  let width: number | null = null;
  let height: number | null = null;
  try {
    ({ width, height } = await uploadImageSizes(supabase, base, input));
  } catch (e) {
    console.error("[uploadMedia] storage upload failed:", e);
    await removeImageSizes(supabase, base).catch(() => {}); // roll back
    return { ok: false, error: `Görsel yüklenemedi: ${errMessage(e)}` };
  }

  // 2) Replace the previous image for this alan (delete old files + row).
  await purgeAlan(supabase, alan);

  // 3) DB record — only now that the Storage files exist.
  const { error } = await supabase.from("media").insert({
    storage_path: base,
    alan,
    oran: spec.oran,
    genislik: width,
    yukseklik: height,
  });
  if (error) {
    console.error("[uploadMedia] db insert failed:", error);
    await removeImageSizes(supabase, base).catch(() => {}); // don't orphan files
    return { ok: false, error: `Kayıt yazılamadı: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/yonetim/icerik");
  return { ok: true, error: null };
}

export async function deleteMedia(
  formData: FormData
): Promise<MediaActionState> {
  const alan = String(formData.get("alan") ?? "");
  if (!ALLOWED[alan]) return { ok: false, error: "Geçersiz alan." };

  const supabase = createAdminClient();
  await purgeAlan(supabase, alan);

  revalidatePath("/");
  revalidatePath("/yonetim/icerik");
  return { ok: true, error: null };
}
