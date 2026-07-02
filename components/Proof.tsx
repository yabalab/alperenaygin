"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { revealProps } from "./reveal";
import ProofCard from "./ProofCard";
import { PROOF_ITEMS } from "@/lib/proof-items";

const IG_URL = "https://instagram.com/alperenayginhairstudio";

// Lightbox gallery: before + after of every item, in order.
const GALLERY = PROOF_ITEMS.flatMap((it) => [
  { src: it.before, type: "image" as const, alt: it.beforeAlt },
  { src: it.after, type: "image" as const, alt: it.afterAlt },
]);

export default function Proof() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const draggingRef = useRef(false);

  // Scroll drift (GSAP ScrollTrigger, scrubbed): the two polaroids open apart at
  // the top/bottom of the section and nest together (`--drift` 0) at centre.
  // Driven via a CSS var so it composes with the CSS/Tailwind hover + entry
  // transforms and survives Swiper's loop clones.
  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;
      el.style.setProperty("--drift", "0");
      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: carouselRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
        onUpdate: () => {
          // Let user interaction win: freeze drift while swiping.
          if (draggingRef.current) return;
          const drift = Math.abs(proxy.p - 0.5) * 2; // 1 at edges, 0 at centre
          el.style.setProperty("--drift", drift.toFixed(3));
        },
      });
    },
    { scope: sectionRef }
  );

  useEffect(() => () => Fancybox.close(), []);

  // Delegated click → open Fancybox at the clicked item's "after" image.
  const onCarouselClick = (e: MouseEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest("[data-proof-index]");
    if (!card) return;
    const i = Number(card.getAttribute("data-proof-index"));
    Fancybox.show(GALLERY, { startIndex: i * 2 + 1 });
  };

  return (
    <section
      id="kanit"
      ref={sectionRef}
      aria-label="Kanıt"
      className="border-t border-[rgba(14,14,12,0.06)] bg-paper-cool py-[42px] px-[clamp(22px,5vw,64px)] md:py-[clamp(68px,10vw,128px)]"
    >
      <div className="mx-auto max-w-[1160px]">
        <motion.div {...revealProps} className="max-w-[640px]">
          <div className="mb-4 h-px w-[30px] bg-gold" />
          <div className="font-body text-[10.5px] font-light uppercase tracking-label text-clay">
            Uygulamalarımız
          </div>
          <h2 className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight [text-wrap:balance]">
            Öncesi ve sonrası
          </h2>
          <p className="mt-5 font-body text-[clamp(17px,1.4vw,19.5px)] leading-[1.7] text-[rgba(28,27,23,0.78)] [text-wrap:pretty]">
            Aşağıdakiler gerçek. Kadraj her zaman kusursuz değil — çünkü bunlar
            stüdyo değil, atölye.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          onClick={onCarouselClick}
          className="mx-auto mt-[clamp(44px,6vw,72px)] w-full max-w-[680px]"
        >
          <Swiper
            onSwiper={(s) => {
              swiperRef.current = s;
            }}
            onSliderFirstMove={() => {
              draggingRef.current = true;
            }}
            onTouchEnd={() => {
              setTimeout(() => {
                draggingRef.current = false;
              }, 60);
            }}
            // mobile: one full-width item; desktop: fixed-width item so the
            // neighbours' edges peek at the sides.
            slidesPerView="auto"
            centeredSlides
            spaceBetween={24}
            loop
            grabCursor
          >
            {PROOF_ITEMS.map((item, i) => (
              <SwiperSlide key={i} className="!h-auto !w-full py-2 md:!w-[380px]">
                <ProofCard item={item} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Prev / next */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Önceki"
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(138,111,79,0.4)] text-[18px] text-ink-soft transition-colors hover:border-gold hover:text-clay"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Sonraki"
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(138,111,79,0.4)] text-[18px] text-ink-soft transition-colors hover:border-gold hover:text-clay"
            >
              ›
            </button>
          </div>
        </div>

        <motion.p {...revealProps} className="mt-[clamp(28px,4vw,40px)] text-center">
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener"
            className="border-b border-[rgba(184,149,106,0.55)] pb-1 font-body text-[10.5px] font-light uppercase tracking-label text-ink-soft transition-colors duration-[400ms] hover:text-clay"
          >
            Daha fazlası Instagram&apos;da →{" "}
            <span className="normal-case">@alperenayginhairstudio</span>
          </a>
        </motion.p>
      </div>
    </section>
  );
}
