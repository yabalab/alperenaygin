// Admin booking slots — hourly 10:00–19:00. Wider than the public site
// (10:00–18:00) because the admin can also log a late/closing appointment.
export const ADMIN_SLOT_HOURS: string[] = Array.from({ length: 10 }, (_, i) =>
  `${String(10 + i).padStart(2, "0")}:00`
);
