"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { ALL_STATUSES } from "@/lib/crm/status";
import type { AppointmentStatus } from "@/lib/crm/types";

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
