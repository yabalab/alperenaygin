"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppointmentModal } from "./AppointmentModalProvider";

const MORPH = { layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } };

const NAV_LINKS = [
  { href: "#modeller", label: "Modeller" },
  { href: "#surec", label: "Süreç" },
  { href: "#kanit", label: "Uygulamalar" },
  { href: "#iletisim", label: "İletişim" },
];

const PHONE = "+905354838997";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useAppointmentModal();

  // Reference: header background firms up after 8px of scroll (or when menu open).
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between gap-4 backdrop-blur-[14px] transition-[background-color,border-color] duration-[600ms] ease-smooth"
        style={{
          paddingInline: "clamp(18px,4vw,46px)",
          background: solid ? "rgba(244,239,230,0.82)" : "rgba(244,239,230,0.35)",
          borderBottom: solid
            ? "1px solid rgba(184,149,106,0.3)"
            : "1px solid rgba(14,14,12,0.06)",
        }}
      >
        <a href="#top" className="flex items-center">
          <Image
            src="/images/logo-aa.png"
            alt="Alperen Aygın Hair Studio"
            width={1179}
            height={1091}
            priority
            className="block mix-blend-multiply"
            style={{ height: 52, width: "auto" }}
          />
        </a>

        {/* Desktop nav */}
        <nav
          className="hidden items-center desk:flex"
          style={{ gap: "clamp(18px,2.4vw,32px)" }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-[10px] font-light uppercase tracking-label text-ink-soft transition-colors duration-[400ms] hover:text-clay"
            >
              {l.label}
            </a>
          ))}
          <motion.button
            type="button"
            layoutId="randevu-header-desk"
            transition={MORPH}
            onClick={() => open("randevu-header-desk")}
            className="inline-flex cursor-pointer items-center rounded-full border-none bg-ink-deep px-[18px] pb-[10px] pt-[11px] font-body text-[9.5px] font-light uppercase tracking-label text-paper transition-colors duration-500 ease-smooth hover:bg-clay"
          >
            <motion.span layoutId="randevu-header-desk-label" transition={MORPH}>
              Randevu
            </motion.span>
          </motion.button>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-[10px] desk:hidden">
          <motion.button
            type="button"
            layoutId="randevu-header-mobile"
            transition={MORPH}
            onClick={() => open("randevu-header-mobile")}
            className="inline-flex cursor-pointer items-center rounded-full border-none bg-ink-deep px-[15px] pb-[9px] pt-[10px] font-body text-[9px] font-light uppercase tracking-label text-paper"
          >
            <motion.span layoutId="randevu-header-mobile-label" transition={MORPH}>
              Randevu
            </motion.span>
          </motion.button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menü"
            aria-expanded={menuOpen}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-[rgba(14,14,12,0.22)] bg-transparent p-0"
          >
            <span
              className="block h-[1.5px] w-4 bg-ink-deep transition-transform duration-500 ease-smooth"
              style={{
                transform: menuOpen
                  ? "translateY(3.25px) rotate(45deg)"
                  : undefined,
              }}
            />
            <span
              className="block h-[1.5px] w-4 bg-ink-deep transition-transform duration-500 ease-smooth"
              style={{
                transform: menuOpen
                  ? "translateY(-3.25px) rotate(-45deg)"
                  : undefined,
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          className="fixed inset-x-0 top-16 z-[49] flex animate-fade-up flex-col border-b border-[rgba(184,149,106,0.35)] bg-[rgba(244,239,230,0.94)] px-6 pb-[26px] pt-[10px] backdrop-blur-[18px] desk:hidden"
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-[rgba(14,14,12,0.08)] py-4 font-body text-[11px] font-light uppercase tracking-label text-ink-soft"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`tel:${PHONE}`}
            className="pt-[18px] font-body text-[10px] font-light uppercase tracking-label text-clay"
          >
            ARA: 0 535 483 89 97
          </a>
        </div>
      )}
    </>
  );
}
