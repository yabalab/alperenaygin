"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Calendar from "./Calendar";
import TurnstileWidget from "./TurnstileWidget";
import { formatTrPhone, isValidTrPhone, sanitizeTrPhone } from "@/lib/phone";
import { SLOT_HOURS } from "@/lib/availability";
import { submitBooking } from "@/app/actions/booking";
import type { Availability } from "@/lib/booking";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const EASE = [0.16, 1, 0.3, 1] as const;
const MORPH = { layout: { duration: 0.5, ease: EASE } };

type Props = {
  /** layoutId of the trigger that opened the modal (null = closed). */
  source: string | null;
  onClose: () => void;
};

// Dark theme — same language as the "Kimse görmeden" (Atölye) section.
const labelCls =
  "font-body text-[9.5px] font-light uppercase tracking-label text-[rgba(244,239,230,0.55)]";
const inputCls =
  "w-full box-border rounded-none border-0 border-b border-[rgba(244,239,230,0.25)] bg-transparent px-[2px] py-[9px] font-body text-[18px] text-paper outline-none transition-colors duration-[400ms] focus:border-b-gold placeholder:text-[rgba(244,239,230,0.3)]";

export default function AppointmentModal({ source, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // raw digits
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [pending, startTransition] = useTransition();
  // Time-trap baseline — set when the modal opens.
  const openedAtRef = useRef<number>(0);

  const onToken = useCallback((t: string) => setTurnstileToken(t), []);

  const reset = () => {
    setName("");
    setPhone("");
    setDate(null);
    setTime(null);
    setDone(false);
    setClosing(false);
    setError(null);
    setTurnstileToken("");
  };

  // Two-phase close: fade the content out first, then unmount so the panel
  // morphs back to the button over cleared space (no scale distortion).
  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  // ESC to close + lock background scroll while open. Also: on open, stamp the
  // time-trap baseline and fetch real availability once.
  useEffect(() => {
    if (!source) return;
    openedAtRef.current = Date.now();
    if (!availability) {
      fetch("/api/availability")
        .then((r) => r.json())
        .then((a: Availability) => setAvailability(a))
        .catch(() => {});
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  // Real availability for the selected day (whole-day closed → all slots full).
  const fullDays = availability?.fullDays ?? [];
  const booked = date
    ? fullDays.includes(date)
      ? SLOT_HOURS
      : (availability?.bookedByDate[date] ?? [])
    : [];
  const canSubmit =
    name.trim() !== "" && isValidTrPhone(phone) && !!date && !!time;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || pending) return;
    setError(null);

    const fd = new FormData(e.currentTarget); // picks up honeypot field
    fd.set("name", name);
    fd.set("phone", phone);
    fd.set("tarih", date ?? "");
    fd.set("saat", time ?? "");
    fd.set("formTs", String(openedAtRef.current));
    fd.set("cf-turnstile-response", turnstileToken);

    startTransition(async () => {
      const res = await submitBooking(fd);
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  };

  const contentVisible = !!source && !closing;

  return (
    <AnimatePresence onExitComplete={reset}>
      {source && (
        <motion.div
          key="appointment-modal"
          className="fixed inset-0 z-[100] flex items-stretch justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Randevu al"
        >
          {/* Overlay — darker + blur; its exit keeps the subtree alive for the
              morph-back. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={handleClose}
            className="absolute inset-0 bg-[rgba(8,8,7,0.72)] backdrop-blur-[8px]"
          />

          {/* Panel — the clicked button physically grows into this (layoutId). */}
          <motion.div
            layoutId={source}
            transition={MORPH}
            style={{
              background: "linear-gradient(180deg,#16130D 0%,#0E0E0C 100%)",
              boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7)",
            }}
            className="relative z-[1] flex h-[100dvh] w-full flex-col overflow-y-auto px-6 pb-10 pt-6 text-paper sm:h-auto sm:max-h-[90vh] sm:w-[520px] sm:rounded-[16px] sm:border sm:border-[rgba(244,239,230,0.12)] sm:px-8 sm:py-9"
          >
            {/* The button's label grows into this eyebrow (shared layoutId). */}
            <motion.span
              layoutId={`${source}-label`}
              transition={MORPH}
              className="inline-block self-start font-body text-[9.5px] font-light uppercase tracking-label text-gold"
            >
              Randevu
            </motion.span>

            {/* Everything else fades in after the panel has grown. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: contentVisible ? 1 : 0 }}
              transition={{
                duration: contentVisible ? 0.4 : 0.15,
                delay: contentVisible ? 0.24 : 0,
                ease: EASE,
              }}
            >
              {/* Close */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Kapat"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(244,239,230,0.2)] text-[18px] text-[rgba(244,239,230,0.7)] transition-colors hover:border-gold hover:text-gold sm:right-5 sm:top-5"
              >
                ×
              </button>

              {done ? (
                <div className="mt-4 rounded-[6px] border border-[rgba(184,149,106,0.45)] bg-[rgba(244,239,230,0.04)] px-[30px] py-9 text-center">
                  <div className="font-body text-[10px] font-light uppercase tracking-label text-gold">
                    Randevu isteğin alındı
                  </div>
                  <p className="mx-auto mt-[14px] max-w-[34ch] font-body text-[clamp(19px,2vw,24px)] font-normal leading-[1.35] text-paper">
                    Randevunuz işleme alındı. Onaylandığında size bilgi vereceğiz.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-3 mt-2 h-px w-[30px] bg-gold" />
                  <h2 className="font-display text-[clamp(26px,4vw,34px)] font-[380] leading-[1.08] tracking-tight text-paper">
                    Sana bir saat ayıralım.
                  </h2>
                  <p className="mt-3 font-body text-[15px] leading-[1.6] text-[rgba(244,239,230,0.72)]">
                    Birkaç bilgi bırak, uygun gününü ve saatini seç. Onayı biz
                    veririz.
                  </p>

                  <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-6">
                    {/* Honeypot — hidden from users; bots that fill it get rejected. */}
                    <input
                      type="text"
                      name="sirket"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
                    />

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
                        className={inputCls}
                      />
                    </label>

                    <div className="flex flex-col gap-[10px]">
                      <span className={labelCls}>Gün</span>
                      <Calendar
                        value={date}
                        disabledDates={fullDays}
                        onSelect={(iso) => {
                          setDate(iso);
                          setTime(null); // slots depend on the day
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <span className={labelCls}>Saat</span>
                      {!date ? (
                        <p className="font-accent text-[15px] italic text-[rgba(244,239,230,0.5)]">
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
                                    ? "cursor-not-allowed border-dashed border-[rgba(244,239,230,0.15)] text-[rgba(244,239,230,0.28)] line-through"
                                    : selected
                                      ? "border-gold bg-gold text-ink-deep"
                                      : "border-[rgba(244,239,230,0.28)] text-paper hover:border-gold hover:text-gold"
                                }`}
                              >
                                {h}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>

                    {/* Bot koruması — az müdahaleci, çoğu ziyaretçiye görünmez. */}
                    {TURNSTILE_SITE_KEY && (
                      <TurnstileWidget
                        siteKey={TURNSTILE_SITE_KEY}
                        onToken={onToken}
                      />
                    )}

                    {error && (
                      <p className="font-body text-[13px] text-[#e6a5a0]">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={!canSubmit || pending}
                      className="mt-1 inline-flex items-center justify-center gap-[10px] self-start rounded-full bg-paper px-7 pb-4 pt-[17px] font-body text-[10.5px] font-light uppercase tracking-label text-ink-deep transition-all duration-500 ease-smooth enabled:hover:bg-gold disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {pending ? "Gönderiliyor…" : "Randevuyu oluştur"}{" "}
                      <span className="font-accent text-[15px] tracking-normal">
                        →
                      </span>
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
