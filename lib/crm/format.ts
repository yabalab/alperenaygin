// Date/time helpers for the CRM panel. All in Turkish.
// `tarih` is a plain 'YYYY-MM-DD' string — parse it as a LOCAL date (not UTC)
// so the day never shifts.

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function todayIso(): string {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

/** Whole days between today and the appointment date (negative = past). */
export function daysFromToday(iso: string): number {
  const a = parseLocalDate(todayIso()).getTime();
  const b = parseLocalDate(iso).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** "5 Temmuz 2026 Cmt" */
export function formatFullDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "short",
  }).format(parseLocalDate(iso));
}

/** Short, list-friendly label: "Bugün", "Yarın", else "5 Tem Cmt". */
export function dayLabel(iso: string): string {
  const diff = daysFromToday(iso);
  if (diff === 0) return "Bugün";
  if (diff === 1) return "Yarın";
  if (diff === -1) return "Dün";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    weekday: "short",
  }).format(parseLocalDate(iso));
}

/** Timestamptz -> "3 Tem, 14:20" (for note history). */
export function formatTimestamp(ts: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}
