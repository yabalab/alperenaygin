import type { AppointmentStatus, SlotCount, SlotCounts } from "./types";

// Pure helpers (no server-only) — safe in server or client. Confirmed (onaylandi)
// and pending (bekliyor) are counted SEPARATELY. iptal/gelmedi/tamamlandi don't
// count toward an active slot.

export function buildSlotCounts(
  rows: readonly { tarih: string; saat: string; durum: AppointmentStatus }[]
): SlotCounts {
  const out: SlotCounts = {};
  for (const r of rows) {
    if (r.durum !== "onaylandi" && r.durum !== "bekliyor") continue;
    const day = (out[r.tarih] ??= {});
    const c = (day[r.saat] ??= { confirmed: 0, pending: 0 });
    if (r.durum === "onaylandi") c.confirmed++;
    else c.pending++;
  }
  return out;
}

/** "1 onaylı" | "1 onaylı · 2 bekleyen" | null (empty slot → no badge). */
export function slotCountLabel(c: SlotCount | undefined): string | null {
  if (!c || (c.confirmed === 0 && c.pending === 0)) return null;
  const parts: string[] = [];
  if (c.confirmed > 0) parts.push(`${c.confirmed} onaylı`);
  if (c.pending > 0) parts.push(`${c.pending} bekleyen`);
  return parts.join(" · ");
}
