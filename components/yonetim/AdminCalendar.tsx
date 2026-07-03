"use client";

import { useMemo, useState } from "react";

// Light-theme calendar for the admin panel. Same Monday-first grid + logic as
// the public site Calendar, but (1) panel/cream palette and (2) NO upper bound —
// the admin can page arbitrarily far ahead (e.g. to close a bayram). Past days
// stay disabled.

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const WEEKDAYS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export default function AdminCalendar({
  value,
  onSelect,
}: {
  value: string | null;
  onSelect: (iso: string) => void;
}) {
  const today = useMemo(() => midnight(new Date()), []);
  const [view, setView] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const minIndex = today.getFullYear() * 12 + today.getMonth();
  const viewIndex = view.year * 12 + view.month;
  const prevDisabled = viewIndex <= minIndex;

  const shift = (delta: number) => {
    const idx = viewIndex + delta;
    if (idx < minIndex) return;
    setView({ year: Math.floor(idx / 12), month: idx % 12 });
  };

  const cells = useMemo(() => {
    const firstDow = (new Date(view.year, view.month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const out: (number | null)[] = [];
    for (let i = 0; i < firstDow; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(d);
    return out;
  }, [view]);

  const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="rounded-xl border border-ink-deep/10 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={prevDisabled}
          aria-label="Önceki ay"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-deep/15 text-[18px] text-ink-soft transition-colors disabled:cursor-not-allowed disabled:opacity-25 enabled:hover:border-gold enabled:hover:text-gold"
        >
          ‹
        </button>
        <div className="flex flex-col items-center leading-none">
          <span className="font-display text-[20px] font-medium text-ink-deep">
            {MONTHS[view.month]}
          </span>
          <span className="mt-[3px] font-body text-[10px] font-light tracking-label text-ink-soft/50">
            {view.year}
          </span>
        </div>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Sonraki ay"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-deep/15 text-[18px] text-ink-soft transition-colors hover:border-gold hover:text-gold"
        >
          ›
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 border-b border-ink-deep/8">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="pb-2 text-center font-body text-[9px] font-light uppercase tracking-label text-ink-soft/40"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`b${i}`} />;
          const iso = toIso(view.year, view.month, d);
          const date = new Date(view.year, view.month, d);
          const disabled = date < today;
          const selected = value === iso;
          const isToday = iso === todayIso;

          return (
            <div key={iso} className="flex items-center justify-center">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(iso)}
                aria-pressed={selected}
                aria-label={`${d} ${MONTHS[view.month]} ${view.year}`}
                className={`relative flex h-[42px] w-[42px] items-center justify-center rounded-full font-display text-[16px] transition-colors ${
                  disabled
                    ? "cursor-not-allowed text-ink-deep/20"
                    : selected
                      ? "bg-gold text-ink-deep"
                      : "text-ink-deep hover:bg-black/5"
                }`}
              >
                {d}
                {isToday && !selected && (
                  <span className="absolute bottom-[7px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-gold" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
