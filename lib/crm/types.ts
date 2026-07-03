export type AppointmentStatus =
  | "bekliyor"
  | "onaylandi"
  | "tamamlandi"
  | "iptal"
  | "gelmedi";

export type AppointmentSource = "site" | "manuel";

export type CustomerLite = {
  id: string;
  ad: string;
  telefon: string;
};

export type AppointmentRow = {
  id: string;
  tarih: string; // 'YYYY-MM-DD'
  saat: string; // 'HH:MM'
  durum: AppointmentStatus;
  kaynak: AppointmentSource;
  not_metni: string | null;
  created_at: string;
  customer: CustomerLite | null;
};

export type AppointmentNote = {
  id: string;
  icerik: string;
  created_at: string;
};

/** Confirmed vs pending kept SEPARATE (onaylı=dolu, bekleyen=karar verilmemiş). */
export type SlotCount = { confirmed: number; pending: number };

/** tarih -> saat -> counts. Only slots with ≥1 appointment appear. */
export type SlotCounts = Record<string, Record<string, SlotCount>>;
