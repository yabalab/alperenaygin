import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { AppointmentRow, AppointmentNote } from "./types";

const SELECT =
  "id, tarih, saat, durum, kaynak, not_metni, created_at, customer:customers(id, ad, telefon)";

// Supabase may hand back an embedded to-one relation as an object or a
// single-element array depending on how it resolves the FK. Normalise to a
// single object (or null).
function normalize(row: Record<string, unknown>): AppointmentRow {
  const c = row.customer as unknown;
  const customer = Array.isArray(c) ? (c[0] ?? null) : (c ?? null);
  return { ...(row as object), customer } as AppointmentRow;
}

/** All appointments, soonest first. Grouping/filtering happens in the UI. */
export async function getAppointments(): Promise<AppointmentRow[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("appointments")
    .select(SELECT)
    .order("tarih", { ascending: true })
    .order("saat", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(normalize);
}

export type AppointmentDetail = {
  appointment: AppointmentRow;
  notes: AppointmentNote[];
  /** Same customer's other appointments (history), newest first. */
  others: AppointmentRow[];
};

export async function getAppointmentDetail(
  id: string
): Promise<AppointmentDetail | null> {
  const supabase = await createServerSupabase();

  const { data: appt } = await supabase
    .from("appointments")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();

  if (!appt) return null;
  const appointment = normalize(appt);

  const { data: notes } = await supabase
    .from("notes")
    .select("id, icerik, created_at")
    .eq("appointment_id", id)
    .order("created_at", { ascending: false });

  let others: AppointmentRow[] = [];
  if (appointment.customer) {
    const { data: o } = await supabase
      .from("appointments")
      .select(SELECT)
      .eq("customer_id", appointment.customer.id)
      .neq("id", id)
      .order("tarih", { ascending: false });
    others = (o ?? []).map(normalize);
  }

  return { appointment, notes: (notes ?? []) as AppointmentNote[], others };
}
