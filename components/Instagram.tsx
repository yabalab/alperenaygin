"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { revealProps } from "./reveal";
import { INSTAGRAM_POSTS, INSTAGRAM_URL } from "@/lib/instagram";

const GALLERY = INSTAGRAM_POSTS.map((p) => ({
  src: p.src,
  type: "image" as const,
  alt: p.alt,
}));

export default function Instagram() {
  const sectionRef = useRef<HTMLElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);

  // Very light scroll-linked horizontal drift (no auto-scroll). scrub → idle at
  // rest; sets transform (composited) so backdrop-blurs never stall it.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const d = { p: 0 };
      gsap.to(d, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
        onUpdate: () => {
          const el = driftRef.current;
          if (el) el.style.transform = `translateX(${(0.5 - d.p) * 44}px)`;
        },
      });
    },
    { scope: sectionRef }
  );

  const openAt = (i: number) => Fancybox.show(GALLERY, { startIndex: i });

  return (
    <section
      ref={sectionRef}
      aria-label="Instagram"
      className="overflow-hidden border-y border-[rgba(14,14,12,0.05)] bg-card-cream py-[clamp(48px,7vw,84px)]"
    >
      <div className="mx-auto max-w-[1160px] px-[clamp(22px,5vw,64px)]">
        <motion.div
          {...revealProps}
          className="mb-[clamp(20px,3vw,30px)] flex items-center justify-between gap-4"
        >
          <p className="font-body text-[10px] font-light uppercase tracking-label text-clay">
            Instagram ·{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener"
              className="border-b border-[rgba(184,149,106,0.5)] normal-case text-clay transition-colors hover:text-gold"
            >
              @alperenayginhairstudio
            </a>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Önceki"
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(138,111,79,0.4)] text-[16px] text-ink-soft transition-colors hover:border-gold hover:text-clay"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Sonraki"
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(138,111,79,0.4)] text-[16px] text-ink-soft transition-colors hover:border-gold hover:text-clay"
            >
              ›
            </button>
          </div>
        </motion.div>
      </div>

      <div ref={driftRef} className="px-[clamp(22px,5vw,64px)]">
        <Swiper
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
          slidesPerView={2.3}
          spaceBetween={14}
          grabCursor
          breakpoints={{
            640: { slidesPerView: 3.4, spaceBetween: 16 },
            1024: { slidesPerView: 5.3, spaceBetween: 18 },
          }}
        >
          {INSTAGRAM_POSTS.map((post, i) => (
            <SwiperSlide key={post.src + i}>
              <button
                type="button"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  openAt(i);
                }}
                aria-label="Instagram gönderisini büyüt"
                className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-[4px] border border-[rgba(14,14,12,0.08)]"
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  draggable={false}
                  sizes="(min-width: 1024px) 210px, (min-width: 640px) 30vw, 44vw"
                  className="object-cover transition-transform duration-[800ms] ease-smooth group-hover:scale-105"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
