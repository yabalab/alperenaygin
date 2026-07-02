"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppointmentModal } from "./AppointmentModalProvider";

/**
 * Fixed bottom-right "Randevu" chip. Mirrors the reference:
 * visible once the hero has scrolled out, hidden again while the
 * contact/booking section is in view (showChip = heroOut && !contactIn).
 */
export default function RandevuChip() {
  const [heroOut, setHeroOut] = useState(false);
  const [contactIn, setContactIn] = useState(false);
  const { openFrom } = useAppointmentModal();

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

  const show = heroOut && !contactIn;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={openFrom}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-[18px] right-[18px] z-[48] inline-flex cursor-pointer items-center gap-[9px] rounded-full border border-[rgba(184,149,106,0.45)] bg-[rgba(14,14,12,0.9)] px-[22px] pb-[14px] pt-[15px] font-body text-[10px] font-light uppercase tracking-label text-paper backdrop-blur-[10px] transition-colors duration-500 ease-smooth hover:bg-[rgba(138,111,79,0.95)]"
          style={{ boxShadow: "0 10px 30px rgba(14,14,12,0.22)" }}
        >
          Randevu{" "}
          <span className="font-accent text-[14px] tracking-normal">→</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
