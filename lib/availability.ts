/**
 * Booking availability — FAKE data for the frontend track.
 *
 * `BOOKED_SLOTS` maps an ISO date ("YYYY-MM-DD") to the list of hour slots
 * that are already taken (full). Any slot not listed is available.
 *
 * Backend track: replace `getBookedSlots` with a Supabase query. Keep the
 * same shape (date -> string[] of "HH:00") so the UI doesn't change.
 */

// Working hours: hourly slots 10:00–18:00 (studio closes 19:00).
export const SLOT_HOURS: string[] = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

// Sample booked slots. Dates are illustrative placeholders.
export const BOOKED_SLOTS: Record<string, string[]> = {
  "2026-07-03": ["10:00", "11:00", "14:00"],
  "2026-07-06": ["12:00", "13:00"],
  "2026-07-10": ["10:00", "15:00", "16:00", "17:00"],
  "2026-07-15": ["11:00", "15:00"],
  "2026-07-20": ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  "2026-07-24": ["13:00", "18:00"],
};

/** Returns the taken hour-slots for a given ISO date (empty if none). */
export function getBookedSlots(isoDate: string): string[] {
  return BOOKED_SLOTS[isoDate] ?? [];
}
