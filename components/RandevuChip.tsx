"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppointmentModal } from "./AppointmentModalProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Fixed bottom-right "Randevu" chip.
 * Base visibility (kept from before): hidden over the hero, shown after it,
 * hidden again while the İletişim section is in view; click morphs into the
 * modal (shared layoutId).
 * Added: hides on scroll-down / shows on scroll-up, and flips to a light skin
 * while it sits over a dark section (Atölye, footer) for readable contrast.
 */
export default function RandevuChip() {
  const [heroOut, setHeroOut] = useState(false);
  const [contactIn, setContactIn] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const { open } = useAppointmentModal();

  // Base visibility anchors (unchanged behaviour).
  useEffect(() => {
    const hero = document.getElementById("hero");
    const contact = document.getElementById("iletisim");
    const heroIO = new IntersectionObserver(
      ([e]) => setHeroOut(!e.isIntersecting),
      { threshold: 0.05 }
    );
    const contactIO = new IntersectionObserver(
      ([e]) => setContactIn(e.isIntersecting),
      { threshold: 0.15 }
    );
    if (hero) heroIO.observe(hero);
    if (contact) contactIO.observe(contact);
    return () => {
      heroIO.disconnect();
      contactIO.disconnect();
    };
  }, []);

  // Scroll direction + "is the chip over a dark section?" — rAF-throttled reads
  // only (no per-frame DOM writes); state changes drive CSS transitions.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const dy = y - lastY;
      if (Math.abs(dy) > 6) {
        setHiddenByScroll(dy > 0); // down → hide, up → show
        lastY = y;
      }

      const chipY = window.innerHeight - 40; // the chip's vertical position
      const darkEls = [
        document.getElementById("atolye"),
        document.querySelector("footer"),
      ];
      let dark = false;
      for (const el of darkEls) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= chipY && r.bottom >= chipY) {
          dark = true;
          break;
        }
      }
      setOnDark((prev) => (prev === dark ? prev : dark));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseVisible = heroOut && !contactIn;

  return (
    <AnimatePresence>
      {baseVisible && (
        <motion.button
          type="button"
          layoutId="randevu-chip"
          onClick={() => open("randevu-chip")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hiddenByScroll ? 0 : 1, y: hiddenByScroll ? 26 : 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: EASE, layout: { duration: 0.5, ease: EASE } }}
          style={{
            boxShadow: "0 10px 30px rgba(14,14,12,0.22)",
            pointerEvents: hiddenByScroll ? "none" : "auto",
          }}
          className={`fixed bottom-[18px] right-[18px] z-[48] inline-flex cursor-pointer items-center gap-[9px] rounded-full border px-[22px] pb-[14px] pt-[15px] font-body text-[10px] font-light uppercase tracking-label backdrop-blur-[10px] transition-[background-color,color,border-color] duration-[600ms] ease-smooth ${
            onDark
              ? "border-[rgba(14,14,12,0.2)] bg-[rgba(244,239,230,0.92)] text-ink-deep hover:bg-gold hover:text-paper"
              : "border-[rgba(184,149,106,0.45)] bg-[rgba(14,14,12,0.9)] text-paper hover:bg-[rgba(138,111,79,0.95)]"
          }`}
        >
          <motion.span
            layoutId="randevu-chip-label"
            transition={{ layout: { duration: 0.5, ease: EASE } }}
          >
            Randevu
          </motion.span>{" "}
          <span className="font-accent text-[14px] tracking-normal">→</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
