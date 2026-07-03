"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { ALL_STATUSES } from "@/lib/crm/status";
import type { AppointmentStatus } from "@/lib/crm/types";
import { sanitizeTrPhone, isValidTrPhone } from "@/lib/phone";
import { CMS_SECTIONS } from "@/lib/cms/content";
import { packValue } from "@/lib/cms/value";

export async function logout() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  revalidatePath("/yonetim", "layout");
  redirect("/yonetim/login");
}

/**
 * Change an appointment's status (bekliyor→onaylandi/iptal, onaylandi→
 * tamamlandi/gelmedi/iptal). Used from both the list quick-actions and the
 * detail page. NOTE: WhatsApp bildirimi + slot kapatma sonraki turlarda buraya
 * bağlanacak — şimdilik sadece durumu günceller.
 */
export async function setAppointmentStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const durum = String(formData.get("durum") ?? "") as AppointmentStatus;

  if (!id || !ALL_STATUSES.includes(durum)) return;

  const supabase = await createServerSupabase();
  await supabase.from("appointments").update({ durum }).eq("id", id);

  revalidatePath("/yonetim");
  revalidatePath(`/yonetim/randevu/${id}`);
}

/** Add a free note tied to an appointment (and its customer). */
export async function addAppointmentNote(formData: FormData) {
  const appointment_id = String(formData.get("appointmentId") ?? "");
  const customer_id = String(formData.get("customerId") ?? "");
  const icerik = String(formData.get("icerik") ?? "").trim();

  if (!appointment_id || !customer_id || !icerik) return;

  const supabase = await createServerSupabase();
  await supabase.from("notes").insert({ appointment_id, customer_id, icerik });

  revalidatePath(`/yonetim/randevu/${appointment_id}`);
}

export type CreateApptState = { error: string | null };

/**
 * Manual appointment creation + optional slot/day blocking. These two are
 * INDEPENDENT: you can create just an appointment, just a block (bayram — no
 * customer), or both.
 *   - customerMode: "existing" | "new" | "none"
 *   - closeSlot: also write blocked_slots(tarih, saat)
 *   - closeAllDay: write blocked_slots(tarih, saat=null) — whole day closed
 * NOTE: WhatsApp bildirimi sonraki turda buraya bağlanacak.
 */
export async function createManualAppointment(
  _prev: CreateApptState,
  formData: FormData
): Promise<CreateApptState> {
  const tarih = String(formData.get("tarih") ?? "");
  const saat = String(formData.get("saat") ?? "");
  const durum = String(formData.get("durum") ?? "onaylandi") as AppointmentStatus;
  const note = String(formData.get("note") ?? "").trim();
  const closeSlot = formData.get("closeSlot") === "true";
  const closeAllDay = formData.get("closeAllDay") === "true";
  const customerMode = String(formData.get("customerMode") ?? "none");
  const customerId = String(formData.get("customerId") ?? "");
  const newAd = String(formData.get("newAd") ?? "").trim();
  const newPhone = sanitizeTrPhone(String(formData.get("newPhone") ?? ""));

  if (!tarih) return { error: "Tarih seçin." };

  const wantsAppointment = customerMode === "existing" || customerMode === "new";
  if (!wantsAppointment && !closeSlot && !closeAllDay) {
    return {
      error:
        "Randevu için müşteri seçin ya da bir kapatma seçeneği işaretleyin.",
    };
  }
  if ((wantsAppointment || closeSlot) && !closeAllDay && !saat) {
    return { error: "Saat seçin." };
  }
  if (wantsAppointment && !ALL_STATUSES.includes(durum)) {
    return { error: "Geçersiz durum." };
  }

  const supabase = await createServerSupabase();

  // Resolve the customer (phone is identity — reuse an existing one rather than
  // creating a duplicate).
  let resolvedCustomerId: string | null = null;
  if (customerMode === "existing") {
    if (!customerId) return { error: "Müşteri seçin." };
    resolvedCustomerId = customerId;
  } else if (customerMode === "new") {
    if (!newAd) return { error: "Müşteri adı gerekli." };
    if (!isValidTrPhone(newPhone)) {
      return { error: "Geçerli bir telefon girin (05XX XXX XX XX)." };
    }
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("telefon", newPhone)
      .maybeSingle();
    if (existing) {
      resolvedCustomerId = existing.id;
    } else {
      const { data: created, error } = await supabase
        .from("customers")
        .insert({ ad: newAd, telefon: newPhone })
        .select("id")
        .single();
      if (error || !created) return { error: "Müşteri kaydedilemedi." };
      resolvedCustomerId = created.id;
    }
  }

  if (wantsAppointment && resolvedCustomerId) {
    const { error } = await supabase.from("appointments").insert({
      customer_id: resolvedCustomerId,
      tarih,
      saat,
      durum,
      kaynak: "manuel",
      not_metni: note || null,
    });
    if (error) return { error: "Randevu oluşturulamadı." };
  }

  // Blocking — skip if an identical block already exists.
  if (closeAllDay) {
    const { data: existing } = await supabase
      .from("blocked_slots")
      .select("id")
      .eq("tarih", tarih)
      .is("saat", null)
      .maybeSingle();
    if (!existing) {
      await supabase
        .from("blocked_slots")
        .insert({ tarih, saat: null, sebep: note || null });
    }
  } else if (closeSlot && saat) {
    const { data: existing } = await supabase
      .from("blocked_slots")
      .select("id")
      .eq("tarih", tarih)
      .eq("saat", saat)
      .maybeSingle();
    if (!existing) {
      await supabase
        .from("blocked_slots")
        .insert({ tarih, saat, sebep: note || null });
    }
  }

  revalidatePath("/yonetim");
  redirect("/yonetim");
}

export type UpdateCustomerState = { ok: boolean; error: string | null };

/** Update a customer's ad/telefon. telefon is UNIQUE — reject if it collides. */
export async function updateCustomer(
  _prev: UpdateCustomerState,
  formData: FormData
): Promise<UpdateCustomerState> {
  const id = String(formData.get("id") ?? "");
  const ad = String(formData.get("ad") ?? "").trim();
  const telefon = sanitizeTrPhone(String(formData.get("telefon") ?? ""));

  if (!id) return { ok: false, error: "Geçersiz istek." };
  if (!ad) return { ok: false, error: "Ad boş olamaz." };
  if (!isValidTrPhone(telefon)) {
    return { ok: false, error: "Geçerli bir telefon girin (05XX XXX XX XX)." };
  }

  const supabase = await createServerSupabase();

  const { data: dupe } = await supabase
    .from("customers")
    .select("id")
    .eq("telefon", telefon)
    .neq("id", id)
    .maybeSingle();
  if (dupe) {
    return { ok: false, error: "Bu telefon başka bir müşteride kayıtlı." };
  }

  const { error } = await supabase
    .from("customers")
    .update({ ad, telefon })
    .eq("id", id);
  if (error) return { ok: false, error: "Kaydedilemedi, lütfen tekrar deneyin." };

  revalidatePath(`/yonetim/musteriler/${id}`);
  revalidatePath("/yonetim/musteriler");
  return { ok: true, error: null };
}

/** Add a customer-level note (appointment_id = null). */
export async function addCustomerNote(formData: FormData) {
  const customer_id = String(formData.get("customerId") ?? "");
  const icerik = String(formData.get("icerik") ?? "").trim();
  if (!customer_id || !icerik) return;

  const supabase = await createServerSupabase();
  await supabase
    .from("notes")
    .insert({ customer_id, icerik, appointment_id: null });

  revalidatePath(`/yonetim/musteriler/${customer_id}`);
}

export type UpdateContentState = { ok: boolean; error: string | null };

/**
 * Save a CMS section's fields to site_content (value = {tr, en} JSON). Only TR
 * is written now; empty TR reverts that key to the hardcoded default on the
 * site. Revalidates the cached content tag + the homepage.
 */
export async function updateContent(
  _prev: UpdateContentState,
  formData: FormData
): Promise<UpdateContentState> {
  const sectionId = String(formData.get("sectionId") ?? "");
  const section = CMS_SECTIONS.find((s) => s.id === sectionId);
  if (!section) return { ok: false, error: "Geçersiz bölüm." };

  const supabase = await createServerSupabase();
  const rows = section.fields.map((f) => ({
    key: f.key,
    value: packValue(String(formData.get(f.key) ?? "").trim()),
    grup: sectionId,
  }));

  const { error } = await supabase
    .from("site_content")
    .upsert(rows, { onConflict: "key" });
  if (error) return { ok: false, error: "Kaydedilemedi, lütfen tekrar deneyin." };

  revalidatePath("/"); // push edits live (homepage is ISR-cached)
  return { ok: true, error: null };
}
