"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";
import { MEDIA_SIZES } from "@/lib/cms/media";

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

const BUCKET = "site-media";
const MAX_BYTES = 6 * 1024 * 1024;

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
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
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
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Görsel çok büyük." };
  }

  const input = Buffer.from(await file.arrayBuffer());
  const supabase = createAdminClient();
  const base = `${alan}/${randomUUID()}`;

  let width: number | null = null;
  let height: number | null = null;
  try {
    for (const w of MEDIA_SIZES) {
      const out = await sharp(input)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      if (w === 1200) {
        // Actual dimensions of the largest output (withoutEnlargement may keep
        // it smaller than 1200 for a low-res source).
        const m = await sharp(out).metadata();
        width = m.width ?? null;
        height = m.height ?? null;
      }
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(`${base}-${w}.webp`, out, {
          contentType: "image/webp",
          upsert: true,
        });
      if (error) throw error;
    }
  } catch {
    // roll back any files we just wrote
    await supabase.storage
      .from(BUCKET)
      .remove(MEDIA_SIZES.map((w) => `${base}-${w}.webp`));
    return { ok: false, error: "Görsel işlenemedi, lütfen tekrar deneyin." };
  }

  // Replace the previous image for this alan (delete old files + row).
  await purgeAlan(supabase, alan);

  const { error } = await supabase.from("media").insert({
    storage_path: base,
    alan,
    oran: spec.oran,
    genislik: width,
    yukseklik: height,
  });
  if (error) return { ok: false, error: "Kaydedilemedi." };

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
