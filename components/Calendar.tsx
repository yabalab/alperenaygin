"use client";

import { useMemo, useState } from "react";

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
// Monday-first (TR convention)
const WEEKDAYS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

type Props = {
  value: string | null;
  onSelect: (iso: string) => void;
  /** ISO dates that are fully closed (blocked all day) → shown as passive. */
  disabledDates?: string[];
};

export default function Calendar({ value, onSelect, disabledDates }: Props) {
  const disabledSet = useMemo(
    () => new Set(disabledDates ?? []),
    [disabledDates]
  );
  const today = useMemo(() => midnight(new Date()), []);
  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 1);
    return d;
  }, [today]);

  const [view, setView] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const minIndex = today.getFullYear() * 12 + today.getMonth();
  const maxIndex = maxDate.getFullYear() * 12 + maxDate.getMonth();
  const viewIndex = view.year * 12 + view.month;
  const prevDisabled = viewIndex <= minIndex;
  const nextDisabled = viewIndex >= maxIndex;

  const shift = (delta: number) => {
    const idx = viewIndex + delta;
    if (idx < minIndex || idx > maxIndex) return;
    setView({ year: Math.floor(idx / 12), month: idx % 12 });
  };

  // Build the grid cells (leading blanks + days).
  const cells = useMemo(() => {
    const firstDow = (new Date(view.year, view.month, 1).getDay() + 6) % 7; // 0=Mon
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const out: (number | null)[] = [];
    for (let i = 0; i < firstDow; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(d);
    return out;
  }, [view]);

  const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="rounded-[10px] border border-[rgba(244,239,230,0.1)] bg-[rgba(244,239,230,0.03)] p-4 sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={prevDisabled}
          aria-label="Önceki ay"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(244,239,230,0.22)] text-[16px] text-paper transition-colors disabled:cursor-not-allowed disabled:opacity-20 enabled:hover:border-gold enabled:hover:text-gold"
        >
          ‹
        </button>
        <div className="flex flex-col items-center leading-none">
          <span className="font-display text-[20px] font-[440] text-paper">
            {MONTHS[view.month]}
          </span>
          <span className="mt-[3px] font-body text-[10px] font-light tracking-label text-[rgba(244,239,230,0.5)]">
            {view.year}
          </span>
        </div>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={nextDisabled}
          aria-label="Sonraki ay"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(244,239,230,0.22)] text-[16px] text-paper transition-colors disabled:cursor-not-allowed disabled:opacity-20 enabled:hover:border-gold enabled:hover:text-gold"
        >
          ›
        </button>
      </div>

      {/* Weekday labels */}
      <div className="mb-1 grid grid-cols-7 border-b border-[rgba(244,239,230,0.08)]">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="pb-2 text-center font-body text-[9px] font-light uppercase tracking-label text-[rgba(244,239,230,0.5)]"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`b${i}`} />;
          const iso = toIso(view.year, view.month, d);
          const date = new Date(view.year, view.month, d);
          const disabled =
            date < today || date > maxDate || disabledSet.has(iso);
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
                className={`relative flex h-[38px] w-[38px] items-center justify-center rounded-full font-display text-[16px] transition-colors ${
                  disabled
                    ? "cursor-not-allowed text-[rgba(244,239,230,0.22)]"
                    : selected
                      ? "bg-gold text-ink-deep"
                      : "text-paper hover:bg-[rgba(244,239,230,0.08)]"
                }`}
              >
                {d}
                {isToday && !selected && (
                  <span className="absolute bottom-[6px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-gold" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
