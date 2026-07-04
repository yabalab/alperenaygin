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

export type BAActionState = { ok: boolean; error: string | null };

function revalidate() {
  revalidatePath("/");
  revalidatePath("/yonetim/icerik");
}

function readImage(formData: FormData, name: string): File | null {
  const f = formData.get(name);
  if (!(f instanceof File) || f.size === 0) return null;
  return f;
}

/** Create a card: two cropped 1:1 images (inline) + isim + optional yas/sure. */
export async function createBeforeAfter(
  formData: FormData
): Promise<BAActionState> {
  const isim = String(formData.get("isim") ?? "").trim();
  if (!isim) return { ok: false, error: "İsim gerekli." };
  const yas = String(formData.get("yas") ?? "").trim() || null;
  const sure = String(formData.get("sure") ?? "").trim() || null;

  const oncesi = readImage(formData, "oncesi");
  const sonrasi = readImage(formData, "sonrasi");
  if (!oncesi || !sonrasi) {
    return { ok: false, error: "Öncesi ve sonrası görseli gerekli." };
  }
  if (oncesi.size > MAX_IMAGE_BYTES || sonrasi.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Görsel çok büyük." };
  }

  const supabase = createAdminClient();
  const id = randomUUID();
  const oncesiBase = `ba/${id}-oncesi`;
  const sonrasiBase = `ba/${id}-sonrasi`;

  let oDim, sDim;
  try {
    const [ob, sb] = await Promise.all([
      oncesi.arrayBuffer(),
      sonrasi.arrayBuffer(),
    ]);
    oDim = await uploadImageSizes(supabase, oncesiBase, Buffer.from(ob));
    sDim = await uploadImageSizes(supabase, sonrasiBase, Buffer.from(sb));
  } catch (e) {
    console.error("[createBeforeAfter] storage upload failed:", e);
    await removeImageSizes(supabase, oncesiBase).catch(() => {});
    await removeImageSizes(supabase, sonrasiBase).catch(() => {});
    return { ok: false, error: `Görsel yüklenemedi: ${errMessage(e)}` };
  }

  // Append to the end of the list.
  const { data: last } = await supabase
    .from("before_after")
    .select("sira")
    .order("sira", { ascending: false, nullsFirst: false })
    .limit(1);
  const nextSira = (last?.[0]?.sira ?? 0) + 1;

  const { error } = await supabase.from("before_after").insert({
    isim,
    yas,
    sure,
    sira: nextSira,
    aktif: true,
    oncesi_path: oncesiBase,
    oncesi_w: oDim.width,
    oncesi_h: oDim.height,
    sonrasi_path: sonrasiBase,
    sonrasi_w: sDim.width,
    sonrasi_h: sDim.height,
  });
  if (error) {
    await removeImageSizes(supabase, oncesiBase);
    await removeImageSizes(supabase, sonrasiBase);
    return { ok: false, error: "Kaydedilemedi." };
  }

  revalidate();
  return { ok: true, error: null };
}

/** Permanently delete a card AND its Storage images. */
export async function deleteBeforeAfter(
  formData: FormData
): Promise<BAActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Geçersiz kayıt." };

  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from("before_after")
    .select("oncesi_path, sonrasi_path")
    .eq("id", id)
    .single();

  if (row?.oncesi_path) await removeImageSizes(supabase, row.oncesi_path);
  if (row?.sonrasi_path) await removeImageSizes(supabase, row.sonrasi_path);

  const { error } = await supabase.from("before_after").delete().eq("id", id);
  if (error) return { ok: false, error: "Silinemedi." };

  revalidate();
  return { ok: true, error: null };
}

/** Soft show/hide: passive cards keep their row + images but leave the carousel. */
export async function toggleBeforeAfter(
  formData: FormData
): Promise<BAActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Geçersiz kayıt." };
  const aktif = String(formData.get("aktif")) === "true";

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("before_after")
    .update({ aktif })
    .eq("id", id);
  if (error) return { ok: false, error: "Güncellenemedi." };

  revalidate();
  return { ok: true, error: null };
}

/** Move a card one step up/down; normalizes `sira` to 0..n-1. */
export async function moveBeforeAfter(
  formData: FormData
): Promise<BAActionState> {
  const id = String(formData.get("id") ?? "");
  const yon = String(formData.get("yon") ?? "");
  if (!id || (yon !== "up" && yon !== "down")) {
    return { ok: false, error: "Geçersiz istek." };
  }

  const supabase = createAdminClient();
  const { data: rows } = await supabase
    .from("before_after")
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

  // Persist new positions (only rows whose sira actually changed).
  for (let i = 0; i < order.length; i++) {
    const current = list.find((r) => r.id === order[i]);
    if (current?.sira !== i) {
      await supabase.from("before_after").update({ sira: i }).eq("id", order[i]);
    }
  }

  revalidate();
  return { ok: true, error: null };
}

/** Edit a card's texts (isim required; yas/sure optional) without touching images. */
export async function updateBeforeAfterText(
  formData: FormData
): Promise<BAActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Geçersiz kayıt." };
  const isim = String(formData.get("isim") ?? "").trim();
  if (!isim) return { ok: false, error: "İsim gerekli." };
  const yas = String(formData.get("yas") ?? "").trim() || null;
  const sure = String(formData.get("sure") ?? "").trim() || null;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("before_after")
    .update({ isim, yas, sure })
    .eq("id", id);
  if (error) return { ok: false, error: "Güncellenemedi." };

  revalidate();
  return { ok: true, error: null };
}
