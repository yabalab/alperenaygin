import type { AppointmentStatus, AppointmentSource } from "./types";

export const ALL_STATUSES: AppointmentStatus[] = [
  "bekliyor",
  "onaylandi",
  "tamamlandi",
  "iptal",
  "gelmedi",
];

type StatusMeta = {
  label: string;
  /** Badge (pill) classes — must be full literals so Tailwind can scan them. */
  badge: string;
  /** Small status dot. */
  dot: string;
};

export const STATUS_META: Record<AppointmentStatus, StatusMeta> = {
  bekliyor: {
    label: "Onay bekliyor",
    badge: "bg-amber-100 text-amber-900 border-amber-300",
    dot: "bg-amber-500",
  },
  onaylandi: {
    label: "Onaylandı",
    badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
    dot: "bg-emerald-500",
  },
  tamamlandi: {
    label: "Tamamlandı",
    badge: "bg-slate-200 text-slate-700 border-slate-300",
    dot: "bg-slate-400",
  },
  iptal: {
    label: "İptal",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    dot: "bg-rose-400",
  },
  gelmedi: {
    label: "Gelmedi",
    badge: "bg-zinc-200 text-zinc-700 border-zinc-300",
    dot: "bg-zinc-500",
  },
};

export const SOURCE_LABEL: Record<AppointmentSource, string> = {
  site: "Site",
  manuel: "Manuel",
};

export type ActionTone = "positive" | "danger" | "muted";

export type StatusAction = {
  to: AppointmentStatus;
  label: string;
  tone: ActionTone;
};

/** Which status changes are offered from a given status. */
export const STATUS_TRANSITIONS: Record<AppointmentStatus, StatusAction[]> = {
  bekliyor: [
    { to: "onaylandi", label: "Onayla", tone: "positive" },
    { to: "iptal", label: "Reddet", tone: "danger" },
  ],
  onaylandi: [
    { to: "tamamlandi", label: "Tamamlandı", tone: "positive" },
    { to: "gelmedi", label: "Gelmedi", tone: "danger" },
    { to: "iptal", label: "İptal et", tone: "muted" },
  ],
  tamamlandi: [],
  iptal: [],
  gelmedi: [],
};

export const ACTION_TONE_CLASS: Record<ActionTone, string> = {
  positive: "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600",
  danger: "bg-white text-rose-700 border-rose-300 hover:bg-rose-50",
  muted: "bg-white text-ink-soft border-ink-deep/20 hover:bg-black/5",
};
