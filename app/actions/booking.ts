"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeTrPhone, isValidTrPhone } from "@/lib/phone";
import { SLOT_HOURS } from "@/lib/availability";
import { getAvailability, isSlotOpen } from "@/lib/booking";
import { verifyTurnstile } from "@/lib/turnstile";

export type BookingState = { ok: boolean; error: string | null };

const GENERIC_REJECT: BookingState = {
  ok: false,
  error: "Gönderim reddedildi. Lütfen sayfayı yenileyip tekrar deneyin.",
};

/**
 * Public site booking (modal → DB). All validation + writes are server-side.
 * Customer identity is the phone number: reuse an existing customer or create
 * one. Appointment is written as kaynak=site, durum=bekliyor so it surfaces in
 * the panel's "onay bekleyen".
 * NOTE: WhatsApp bildirimi onaydan sonra sonraki turda.
 */
export async function submitBooking(formData: FormData): Promise<BookingState> {
  // --- bot layer 1: honeypot (must stay empty) ---
  if (String(formData.get("sirket") ?? "").trim() !== "") {
    return GENERIC_REJECT;
  }

  // --- bot layer 2: time trap (humans take > 3s to fill the form) ---
  const formTs = Number(formData.get("formTs"));
  if (Number.isFinite(formTs)) {
    const elapsed = Date.now() - formTs;
    // Only punish suspiciously-fast submits; ignore negative (clock skew).
    if (elapsed >= 0 && elapsed < 3000) {
      return {
        ok: false,
        error: "Çok hızlı gönderildi. Lütfen tekrar deneyin.",
      };
    }
  }

  // --- bot layer 3: Cloudflare Turnstile ---
  const token = String(formData.get("cf-turnstile-response") ?? "");
  if (!(await verifyTurnstile(token))) {
    return {
      ok: false,
      error: "Doğrulama başarısız. Lütfen tekrar deneyin.",
    };
  }

  // --- field validation ---
  const name = String(formData.get("name") ?? "").trim();
  const phone = sanitizeTrPhone(String(formData.get("phone") ?? ""));
  const tarih = String(formData.get("tarih") ?? "");
  const saat = String(formData.get("saat") ?? "");

  if (!name) return { ok: false, error: "Lütfen adınızı girin." };
  if (!isValidTrPhone(phone)) {
    return { ok: false, error: "Geçerli bir telefon numarası girin." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tarih) || !SLOT_HOURS.includes(saat)) {
    return { ok: false, error: "Lütfen geçerli bir gün ve saat seçin." };
  }

  // Date must be within the bookable window (today .. +1 month), like the calendar.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const max = new Date(today);
  max.setMonth(max.getMonth() + 1);
  const [y, m, d] = tarih.split("-").map(Number);
  const picked = new Date(y, m - 1, d);
  if (picked < today || picked > max) {
    return { ok: false, error: "Seçilen tarih uygun değil." };
  }

  // Slot must still be open (guards races + tampering).
  const avail = await getAvailability();
  if (!isSlotOpen(avail, tarih, saat)) {
    return {
      ok: false,
      error: "Bu saat dolmuş. Lütfen başka bir saat seçin.",
    };
  }

  // --- write (service_role: server-validated, trusted) ---
  const supabase = createAdminClient();

  let customerId: string | undefined;
  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("telefon", phone)
    .maybeSingle();

  if (existing) {
    customerId = existing.id;
  } else {
    const { data: created, error } = await supabase
      .from("customers")
      .insert({ ad: name, telefon: phone })
      .select("id")
      .single();
    if (error || !created) {
      return { ok: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." };
    }
    customerId = created.id;
  }

  const { error: apptErr } = await supabase.from("appointments").insert({
    customer_id: customerId,
    tarih,
    saat,
    durum: "bekliyor",
    kaynak: "site",
  });
  if (apptErr) {
    return { ok: false, error: "Randevu oluşturulamadı. Lütfen tekrar deneyin." };
  }

  // Panel'deki "onay bekleyen" listesi tazelensin.
  revalidatePath("/yonetim");
  return { ok: true, error: null };
}
