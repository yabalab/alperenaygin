"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  MAX_IMAGE_BYTES,
  uploadImageSizes,
  removeImageSizes,
  errMessage,
} from "@/lib/cms/image-pipeline";

export type IGActionState = { ok: boolean; error: string | null };

function revalidate() {
  revalidatePath("/");
  revalidatePath("/yonetim/icerik");
}

/** Create a post: one cropped 1:1 image (inline) + optional link. */
export async function createInstagram(
  formData: FormData
): Promise<IGActionState> {
  const link = String(formData.get("link") ?? "").trim() || null;

  const file = formData.get("gorsel");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Görsel gerekli." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Görsel çok büyük." };
  }

  const supabase = createAdminClient();
  const id = randomUUID();
  const base = `ig/${id}`;

  let dim;
  try {
    dim = await uploadImageSizes(supabase, base, Buffer.from(await file.arrayBuffer()));
  } catch (e) {
    console.error("[createInstagram] storage upload failed:", e);
    await removeImageSizes(supabase, base).catch(() => {});
    return { ok: false, error: `Görsel yüklenemedi: ${errMessage(e)}` };
  }

  const { data: last } = await supabase
    .from("instagram_posts")
    .select("sira")
    .order("sira", { ascending: false, nullsFirst: false })
    .limit(1);
  const nextSira = (last?.[0]?.sira ?? 0) + 1;

  const { error } = await supabase.from("instagram_posts").insert({
    link,
    sira: nextSira,
    aktif: true,
    gorsel_path: base,
    gorsel_w: dim.width,
    gorsel_h: dim.height,
  });
  if (error) {
    await removeImageSizes(supabase, base);
    return { ok: false, error: "Kaydedilemedi." };
  }

  revalidate();
  return { ok: true, error: null };
}

/** Permanently delete a post AND its Storage image. */
export async function deleteInstagram(
  formData: FormData
): Promise<IGActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Geçersiz kayıt." };

  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from("instagram_posts")
    .select("gorsel_path")
    .eq("id", id)
    .single();

  if (row?.gorsel_path) await removeImageSizes(supabase, row.gorsel_path);

  const { error } = await supabase.from("instagram_posts").delete().eq("id", id);
  if (error) return { ok: false, error: "Silinemedi." };

  revalidate();
  return { ok: true, error: null };
}

/** Soft show/hide: passive posts keep their row + image but leave the band. */
export async function toggleInstagram(
  formData: FormData
): Promise<IGActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Geçersiz kayıt." };
  const aktif = String(formData.get("aktif")) === "true";

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("instagram_posts")
    .update({ aktif })
    .eq("id", id);
  if (error) return { ok: false, error: "Güncellenemedi." };

  revalidate();
  return { ok: true, error: null };
}

/** Move a post one step up/down; normalizes `sira` to 0..n-1. */
export async function moveInstagram(
  formData: FormData
): Promise<IGActionState> {
  const id = String(formData.get("id") ?? "");
  const yon = String(formData.get("yon") ?? "");
  if (!id || (yon !== "up" && yon !== "down")) {
    return { ok: false, error: "Geçersiz istek." };
  }

  const supabase = createAdminClient();
  const { data: rows } = await supabase
    .from("instagram_posts")
    .select("id, sira")
    .order("sira", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  const list = (rows ?? []) as { id: string; sira: number | null }[];
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return { ok: true, error: null };
  const swap = yon === "up" ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= list.length) return { ok: true, error: null }; // edge

  const order = list.map((r) => r.id);
  [order[idx], order[swap]] = [order[swap], order[idx]];

  for (let i = 0; i < order.length; i++) {
    const current = list.find((r) => r.id === order[i]);
    if (current?.sira !== i) {
      await supabase.from("instagram_posts").update({ sira: i }).eq("id", order[i]);
    }
  }

  revalidate();
  return { ok: true, error: null };
}

/** Edit a post's link without touching its image. */
export async function updateInstagramLink(
  formData: FormData
): Promise<IGActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Geçersiz kayıt." };
  const link = String(formData.get("link") ?? "").trim() || null;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("instagram_posts")
    .update({ link })
    .eq("id", id);
  if (error) return { ok: false, error: "Güncellenemedi." };

  revalidate();
  return { ok: true, error: null };
}
