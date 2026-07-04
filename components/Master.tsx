"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { revealProps } from "./reveal";
import MaskReveal from "./MaskReveal";
import { useT } from "./cms/ContentProvider";
import { mediaLoader, type MediaRow } from "@/lib/cms/media";

export default function Master({ portrait }: { portrait?: MediaRow | null }) {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // MOBILE ONLY: a gentle parallax — the portrait drifts up while its cream
  // backdrop drifts down as the section scrolls, giving depth. Distinct from
  // the "Duş al" letter-fill signature. scrub → only moves with scroll (no
  // free-running tween), composited transforms (no reflow). Web is untouched.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(max-width: 767px)", () => {
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
            const img = portraitRef.current;
            const bd = backdropRef.current;
            // portrait drifts up (+22→−22), backdrop drifts the other way.
            if (img) img.style.transform = `translateY(${(0.5 - d.p) * 44}px)`;
            if (bd) bd.style.transform = `translateY(${(d.p - 0.5) * 32}px)`;
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="usta"
      ref={sectionRef}
      aria-label="Usta"
      className="bg-paper py-[42px] px-[clamp(22px,5vw,64px)] md:py-[clamp(68px,10vw,128px)]"
    >
      <div className="mx-auto grid max-w-[1060px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-end gap-[clamp(40px,6vw,90px)]">
        {/* Portrait */}
        <motion.div
          {...revealProps}
          className="relative mx-auto w-full max-w-[420px]"
        >
          <div
            ref={backdropRef}
            className="absolute bottom-0 left-[2%] right-[2%] top-[8%] rounded-b-[12px] rounded-t-[999px] border border-[rgba(184,149,106,0.22)]"
            style={{
              background: "linear-gradient(180deg,#EFE7D8 0%,#EAE0CF 100%)",
              boxShadow: "0 26px 60px -34px rgba(138,111,79,0.42)",
            }}
          />
          <Image
            ref={portraitRef}
            alt="Alperen Aygın — kollar kavuşturulmuş portre"
            sizes="(min-width: 960px) 420px, 100vw"
            className="relative z-[1] block h-auto w-full"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom,#000 80%,transparent 100%)",
              maskImage: "linear-gradient(to bottom,#000 80%,transparent 100%)",
            }}
            {...(portrait
              ? {
                  loader: mediaLoader,
                  src: portrait.storage_path,
                  width: portrait.genislik ?? 1200,
                  height: portrait.yukseklik ?? 1600,
                }
              : {
                  src: "/images/alperen-portre.png",
                  width: 1024,
                  height: 1536,
                })}
          />
        </motion.div>

        {/* Quote */}
        <motion.div {...revealProps} className="pb-[clamp(8px,2vw,36px)]">
          <div className="mb-4 h-px w-[30px] bg-gold" />
          <div className="font-body text-[10.5px] font-light uppercase tracking-label text-clay">
            {t("usta.eyebrow")}
          </div>
          <MaskReveal className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight [text-wrap:balance]">
            {t("usta.title")}
          </MaskReveal>
          <blockquote className="m-0 mt-[26px] p-0">
            <p className="m-0 max-w-[44ch] font-body text-[clamp(18px,1.6vw,22px)] leading-[1.7] text-[rgba(28,27,23,0.82)] [text-wrap:pretty]">
              {t("usta.quote1")}
            </p>
            <p className="mt-[14px] max-w-[44ch] font-body text-[clamp(18px,1.6vw,22px)] leading-[1.7] text-[rgba(28,27,23,0.82)] [text-wrap:pretty]">
              {t("usta.quote2")}
            </p>
            <footer className="mt-6 flex items-center gap-[14px]">
              <span className="h-px w-[26px] bg-gold" />
              <cite className="font-body text-[10.5px] font-light not-italic uppercase tracking-label text-ink-soft">
                {t("usta.signature")}
              </cite>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
