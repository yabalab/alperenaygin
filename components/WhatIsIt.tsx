"use client";

import { motion } from "framer-motion";
import { revealProps } from "./reveal";
import ScrollFillText from "./ScrollFillText";
import MaskReveal from "./MaskReveal";

// The three reassurance points, each with the reference's exact inline SVG.
const POINTS = [
  {
    icon: (
      <>
        <path
          d="M13 3 L8 13 H12 L11 21 L17 10 H13 L14.5 3 Z"
          stroke="#B8956A"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <line x1="4" y1="4" x2="20" y2="20" stroke="#B8956A" strokeWidth="1.4" />
      </>
    ),
    title: "Acısız.",
    desc: "Cerrahi değil. Uygulama sırasında ağrı, sızı yok.",
  },
  {
    icon: (
      <>
        <path
          d="M20 12a8 8 0 1 1 -2.9 -6.2"
          stroke="#B8956A"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M17.5 2.5 L17.3 6.4 L21 7.2"
          stroke="#B8956A"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    title: "Geri dönüşü var.",
    desc: "Kalıcı bir karar vermek zorunda değilsin.",
  },
  {
    icon: (
      <>
        <path d="M4 6 Q9 4 12 6.5 T20 7" stroke="#B8956A" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M4 12 Q9 10 12 12.5 T20 13" stroke="#B8956A" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M4 18 Q9 16 12 18.5 T20 19" stroke="#B8956A" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    title: "Kendi saçına zarar vermez.",
    desc: "Kafa derisi hava alır, terletmez.",
  },
];

export default function WhatIsIt() {
  return (
    <section
      id="nedir"
      aria-label="Protez saç nedir"
      className="bg-paper py-[42px] px-[clamp(22px,5vw,64px)] md:py-[clamp(68px,10vw,128px)]"
    >
      <div className="mx-auto grid max-w-[1160px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-[clamp(40px,6vw,96px)]">
        {/* Left: intro */}
        <motion.div {...revealProps}>
          <div className="mb-4 h-px w-[30px] bg-gold" />
          <div className="font-body text-[10.5px] font-light uppercase tracking-label text-clay">
            Saç Sistemi
          </div>
          <MaskReveal className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight [text-wrap:balance]">
            Protez saç nedir?
          </MaskReveal>
          <p className="mt-[22px] max-w-[46ch] font-body text-[clamp(17.5px,1.4vw,20px)] leading-[1.7] text-[rgba(28,27,23,0.82)] [text-wrap:pretty]">
            Saç kaybı yaşadığın bölgeye, kendi saç yapına birebir uyacak şekilde
            hazırlanmış bir ünite. Medikal sabitleyicilerle yerine oturur. Kendi
            saçın gibi yıkarsın, tararsın, şekil verirsin.
          </p>
        </motion.div>

        {/* Right: points */}
        <div>
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              {...revealProps}
              className={`flex items-baseline gap-[18px] border-t border-[rgba(14,14,12,0.12)] ${
                i === POINTS.length - 1
                  ? "border-b pb-6 pt-[22px]"
                  : "py-[22px]"
              }`}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="flex-none self-center"
              >
                {p.icon}
              </svg>
              <p className="m-0 text-[clamp(16.5px,1.3vw,18.5px)] leading-[1.55]">
                <strong className="font-display text-[1.12em] font-medium">
                  {p.title}
                </strong>{" "}
                <span className="font-body text-[rgba(28,27,23,0.75)]">
                  {p.desc}
                </span>
              </p>
            </motion.div>
          ))}

          {/* Signature slogan — enlarged + scroll-scrubbed letter colour fill */}
          <ScrollFillText
            text="Duş al, denize gir, havuza atla, fön çek, renk değiştir. Kendi saçınla ne yapıyorsan."
            className="mt-8 font-accent text-[clamp(26px,5vw,38px)] italic leading-[1.3] [text-wrap:pretty]"
          />
        </div>
      </div>
    </section>
  );
}
