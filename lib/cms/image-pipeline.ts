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
    let out: Buffer;
    try {
      out = await sharp(input)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (e) {
      // e.g. sharp native binary missing on the serverless runtime.
      throw new Error(`sharp işleme hatası (${w}px): ${errMessage(e)}`);
    }
    if (w === 1200) {
      // Actual dimensions of the largest output (withoutEnlargement may keep
      // it smaller than 1200 for a low-res source).
      const m = await sharp(out).metadata();
      width = m.width ?? null;
      height = m.height ?? null;
    }
    const path = `${base}-${w}.webp`;
    // Upload a Blob (not a raw Buffer): the most portable body across the Node
    // and serverless runtimes — avoids "no error but empty/not-persisted"
    // upload quirks with raw Buffers.
    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, new Blob([new Uint8Array(out)], { type: "image/webp" }), {
        contentType: "image/webp",
        upsert: true,
      });
    if (error) {
      // Surface the REAL storage error (permission, bucket, auth, size…).
      throw new Error(`Storage upload hatası (${path}): ${error.message}`);
    }
  }
  return { width, height };
}

/** Normalize any thrown value to a readable message. */
export function errMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

/** Delete every pre-generated size file for a base path (rollback / cleanup). */
export async function removeImageSizes(supabase: Admin, base: string) {
  await supabase.storage
    .from(MEDIA_BUCKET)
    .remove(MEDIA_SIZES.map((w) => `${base}-${w}.webp`));
}
