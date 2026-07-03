import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import { buildSlotCounts } from "./counts";
import type {
  AppointmentRow,
  AppointmentNote,
  AppointmentStatus,
  CustomerLite,
  SlotCounts,
} from "./types";

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
  /** OTHER appointments at the exact same tarih+saat (with customer, oldest first). */
  sameSlot: AppointmentRow[];
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

  // Other appointments sharing this exact tarih + saat.
  const { data: s } = await supabase
    .from("appointments")
    .select(SELECT)
    .eq("tarih", appointment.tarih)
    .eq("saat", appointment.saat)
    .neq("id", id)
    .order("created_at", { ascending: true });
  const sameSlot = (s ?? []).map(normalize);

  return {
    appointment,
    notes: (notes ?? []) as AppointmentNote[],
    others,
    sameSlot,
  };
}

/** All customers, alphabetical — for the manual-create customer picker. */
export async function getCustomers(): Promise<CustomerLite[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("customers")
    .select("id, ad, telefon")
    .order("ad", { ascending: true });
  return (data ?? []) as CustomerLite[];
}

export type ScheduleData = {
  /** Per date+slot confirmed/pending counts (computed server-side). */
  counts: SlotCounts;
  /** Blocked entries; saat=null means the whole day is closed. */
  blocked: { tarih: string; saat: string | null }[];
};

/** Slot marks for the create form: confirmed/pending counts + blocked slots. */
export async function getScheduleData(): Promise<ScheduleData> {
  const supabase = await createServerSupabase();
  const [a, b] = await Promise.all([
    supabase.from("appointments").select("tarih, saat, durum"),
    supabase.from("blocked_slots").select("tarih, saat"),
  ]);
  return {
    counts: buildSlotCounts(
      (a.data ?? []) as {
        tarih: string;
        saat: string;
        durum: AppointmentStatus;
      }[]
    ),
    blocked: (b.data ?? []) as ScheduleData["blocked"],
  };
}
