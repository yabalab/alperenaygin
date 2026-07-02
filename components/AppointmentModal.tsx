"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Calendar from "./Calendar";
import { formatTrPhone, isValidTrPhone, sanitizeTrPhone } from "@/lib/phone";
import { SLOT_HOURS, getBookedSlots } from "@/lib/availability";

const EASE = [0.16, 1, 0.3, 1] as const;

type Origin = { x: number; y: number };

type Props = {
  isOpen: boolean;
  origin: Origin;
  onClose: () => void;
};

const labelCls =
  "font-body text-[9.5px] font-light uppercase tracking-label text-clay";
const inputCls =
  "w-full box-border rounded-none border-0 border-b border-[rgba(14,14,12,0.28)] bg-transparent px-[2px] py-[9px] font-body text-[18px] text-ink-deep outline-none transition-colors duration-[400ms] focus:border-b-gold";

export default function AppointmentModal({ isOpen, origin, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // raw digits
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const reset = () => {
    setName("");
    setPhone("");
    setDate(null);
    setTime(null);
    setDone(false);
  };

  // ESC to close + lock background scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const booked = date ? getBookedSlots(date) : [];
  const canSubmit =
    name.trim() !== "" && isValidTrPhone(phone) && !!date && !!time;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setDone(true); // NOTE: no backend — fake success (backend track handles this).
  };

  // Balloon origin: offset from viewport centre to the clicked trigger.
  const dx = typeof window !== "undefined" ? origin.x - window.innerWidth / 2 : 0;
  const dy = typeof window !== "undefined" ? origin.y - window.innerHeight / 2 : 0;

  return (
    <AnimatePresence onExitComplete={reset}>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-stretch justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Randevu al"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={onClose}
            className="absolute inset-0 bg-[rgba(14,14,12,0.55)] backdrop-blur-[6px]"
          />

          {/* Panel — balloons from the trigger position */}
          <motion.div
            initial={{ opacity: 0, scale: 0.2, x: dx, y: dy }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.2, x: dx, y: dy }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative z-[1] flex h-[100dvh] w-full flex-col overflow-y-auto bg-paper px-6 pb-10 pt-6 sm:h-auto sm:max-h-[90vh] sm:w-[520px] sm:rounded-[14px] sm:px-8 sm:py-9 sm:shadow-[0_30px_80px_-20px_rgba(14,14,12,0.5)]"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(14,14,12,0.18)] text-[18px] text-ink-soft transition-colors hover:border-gold hover:text-clay sm:right-5 sm:top-5"
            >
              ×
            </button>

            {/* Content fades in after the panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.16 }}
            >
              {done ? (
                <div className="animate-fade-up rounded-[6px] border border-[rgba(184,149,106,0.45)] bg-paper-cool px-[30px] py-9 text-center">
                  <div className="font-body text-[10px] font-light uppercase tracking-label text-clay">
                    Randevu isteğin alındı
                  </div>
                  <p className="mx-auto mt-[14px] max-w-[34ch] font-body text-[clamp(19px,2vw,24px)] font-normal leading-[1.35]">
                    Randevunuz işleme alındı. Onaylandığında size bilgi vereceğiz.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-1 h-px w-[30px] bg-gold" />
                  <div className={labelCls}>Randevu</div>
                  <h2 className="mt-3 font-display text-[clamp(26px,4vw,34px)] font-[380] leading-[1.08] tracking-tight">
                    Sana bir saat ayıralım.
                  </h2>
                  <p className="mt-3 font-body text-[15px] leading-[1.6] text-[rgba(28,27,23,0.7)]">
                    Birkaç bilgi bırak, uygun gününü ve saatini seç. Onayı biz
                    veririz.
                  </p>

                  <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-6">
                    <label className="flex flex-col gap-2">
                      <span className={labelCls}>Ad *</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        className={inputCls}
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className={labelCls}>Telefon *</span>
                      <input
                        type="tel"
                        value={formatTrPhone(phone)}
                        onChange={(e) => setPhone(sanitizeTrPhone(e.target.value))}
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="05XX XXX XX XX"
                        className={`${inputCls} placeholder:text-[rgba(28,27,23,0.3)]`}
                      />
                    </label>

                    <div className="flex flex-col gap-[10px]">
                      <span className={labelCls}>Gün</span>
                      <Calendar
                        value={date}
                        onSelect={(iso) => {
                          setDate(iso);
                          setTime(null); // slots depend on the day
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <span className={labelCls}>Saat</span>
                      {!date ? (
                        <p className="font-accent text-[15px] italic text-[rgba(28,27,23,0.5)]">
                          Önce bir gün seçin.
                        </p>
                      ) : (
                        <motion.div
                          key={date}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="flex flex-wrap gap-[10px]"
                        >
                          {SLOT_HOURS.map((h) => {
                            const full = booked.includes(h);
                            const selected = time === h;
                            return (
                              <button
                                key={h}
                                type="button"
                                disabled={full}
                                onClick={() => setTime(h)}
                                aria-pressed={selected}
                                className={`rounded-full border px-[16px] py-[9px] font-body text-[13px] tracking-[0.06em] transition-all duration-[300ms] ease-smooth ${
                                  full
                                    ? "cursor-not-allowed border-dashed border-[rgba(14,14,12,0.18)] text-[rgba(28,27,23,0.35)] line-through"
                                    : selected
                                      ? "border-ink-deep bg-ink-deep text-paper"
                                      : "border-[rgba(14,14,12,0.28)] text-ink-soft hover:border-gold hover:text-clay"
                                }`}
                              >
                                {h}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="mt-1 inline-flex items-center justify-center gap-[10px] self-start rounded-full bg-ink-deep px-7 pb-4 pt-[17px] font-body text-[10.5px] font-light uppercase tracking-label text-paper transition-all duration-500 ease-smooth enabled:hover:bg-clay disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      Randevuyu oluştur{" "}
                      <span className="font-accent text-[15px] tracking-normal">
                        →
                      </span>
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
