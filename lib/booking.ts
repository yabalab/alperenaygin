import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Real booking availability, computed server-side. Anonymous site visitors
 * cannot read `appointments`/`blocked_slots` under RLS, so this runs with the
 * service_role admin client and returns ONLY derived slot lists (no PII).
 *
 * A slot is full if there is a CONFIRMED (durum=onaylandi) appointment on it OR
 * blocked_slots marks that saat. `fullDays` are days blocked entirely
 * (blocked_slots.saat = null) → the whole day is disabled in the calendar.
 *
 * NOTE: pending (bekliyor) appointments do NOT occupy a slot — several visitors
 * may request the same hour; the admin decides which to confirm.
 */
export type Availability = {
  fullDays: string[];
  bookedByDate: Record<string, string[]>;
};

function todayIso(): string {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

export async function getAvailability(): Promise<Availability> {
  const supabase = createAdminClient();
  const today = todayIso();

  const [appts, blocks] = await Promise.all([
    supabase
      .from("appointments")
      .select("tarih, saat")
      .eq("durum", "onaylandi")
      .gte("tarih", today),
    supabase.from("blocked_slots").select("tarih, saat").gte("tarih", today),
  ]);

  const bookedByDate: Record<string, string[]> = {};
  const fullDays = new Set<string>();

  for (const b of blocks.data ?? []) {
    if (b.saat === null) fullDays.add(b.tarih);
    else (bookedByDate[b.tarih] ??= []).push(b.saat);
  }
  for (const a of appts.data ?? []) {
    (bookedByDate[a.tarih] ??= []).push(a.saat);
  }

  // Dedupe (an appt + a block can land on the same saat).
  for (const k of Object.keys(bookedByDate)) {
    bookedByDate[k] = [...new Set(bookedByDate[k])];
  }

  return { fullDays: [...fullDays], bookedByDate };
}

/** Server-side re-check that a specific slot is bookable (guards races/tampering). */
export function isSlotOpen(
  avail: Availability,
  tarih: string,
  saat: string
): boolean {
  if (avail.fullDays.includes(tarih)) return false;
  return !(avail.bookedByDate[tarih] ?? []).includes(saat);
}
