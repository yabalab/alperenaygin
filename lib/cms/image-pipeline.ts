import "server-only";
import sharp from "sharp";
import type { createAdminClient } from "@/lib/supabase/admin";
import { MEDIA_SIZES } from "./media";

// Shared server-side image pipeline: crop already done client-side, here we
// generate the 3 pre-sized webp variants and store them in the `site-media`
// bucket at `<base>-<width>.webp`. Used by both the singles engine
// (media-actions) and the before/after list (before-after-actions).
//
// NOTE: this is a plain server-only module (NOT "use server") so it can export
// non-action helpers; a "use server" file may only export server actions.

type Admin = ReturnType<typeof createAdminClient>;

export const MEDIA_BUCKET = "site-media";
export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

/**
 * Optimize `input` into the pre-generated webp sizes and upload them under
 * `base`. Returns the largest output's real dimensions. Throws on failure
 * (caller is responsible for rollback via {@link removeImageSizes}).
 */
export async function uploadImageSizes(
  supabase: Admin,
  base: string,
  input: Buffer
): Promise<{ width: number | null; height: number | null }> {
  let width: number | null = null;
  let height: number | null = null;
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
      .from(MEDIA_BUCKET)
      .upload(`${base}-${w}.webp`, out, {
        contentType: "image/webp",
        upsert: true,
      });
    if (error) throw error;
  }
  return { width, height };
}

/** Delete every pre-generated size file for a base path (rollback / cleanup). */
export async function removeImageSizes(supabase: Admin, base: string) {
  await supabase.storage
    .from(MEDIA_BUCKET)
    .remove(MEDIA_SIZES.map((w) => `${base}-${w}.webp`));
}
