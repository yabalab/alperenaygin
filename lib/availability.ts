/**
 * Public booking slots — hourly 10:00–18:00 (studio closes 19:00).
 *
 * Real availability (which of these are taken/closed on a given day) is computed
 * server-side in `lib/booking.ts getAvailability()` from confirmed appointments
 * + blocked_slots, and served to the modal via `/api/availability`. The old
 * fake `BOOKED_SLOTS`/`getBookedSlots` were removed in the backend track.
 */
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
