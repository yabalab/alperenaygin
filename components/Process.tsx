"use client";

import { motion } from "framer-motion";
import { revealProps } from "./reveal";
import MaskReveal from "./MaskReveal";

const STEPS = [
  {
    num: "01",
    title: "Buluşma",
    desc: "On beş dakika. Sadece konuşuruz. Satış yok, baskı yok.",
    gold: false,
  },
  {
    num: "02",
    title: "Ölçü",
    desc: "Kafa yapın, mevcut saçın, ten tonun, yaşam tarzın. Hepsi önemli.",
    gold: false,
  },
  {
    num: "03",
    title: "Uygulama",
    desc: "İki-üç saat. Acı yok, kesik yok, iyileşme yok.",
    gold: false,
  },
  {
    num: "04",
    title: "Yansıma",
    desc: "Aynaya bakarsın. Geri döndün.",
    gold: true,
  },
];

export default function Process() {
  return (
    <section
      id="surec"
      aria-label="Süreç"
      className="border-t border-[rgba(14,14,12,0.06)] bg-paper-warm py-[42px] px-[clamp(22px,5vw,64px)] md:py-[clamp(68px,10vw,128px)]"
    >
      <div className="mx-auto max-w-[1160px]">
        <motion.div {...revealProps} className="max-w-[640px]">
          <div className="mb-4 h-px w-[30px] bg-gold" />
          <div className="font-body text-[10.5px] font-light uppercase tracking-label text-clay">
            Süreç
          </div>
          <MaskReveal className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight [text-wrap:balance]">
            Dört adım. Bir öğleden sonra.
          </MaskReveal>
        </motion.div>

        <div className="mt-[clamp(36px,5vw,60px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-[clamp(24px,3vw,36px)]">
          {STEPS.map((s) => (
            <motion.div
              key={s.num}
              {...revealProps}
              className={`border-t pt-5 ${
                s.gold ? "border-gold" : "border-[rgba(14,14,12,0.14)]"
              }`}
            >
              <div
                className={`font-display text-[clamp(52px,4.5vw,68px)] font-light leading-none ${
                  s.gold ? "text-gold" : "text-[rgba(14,14,12,0.2)]"
                }`}
              >
                {s.num}
              </div>
              <h3 className="mb-2 mt-4 font-display text-[20px] font-[480]">
                {s.title}
              </h3>
              <p className="m-0 font-body text-[16.5px] leading-[1.6] text-[rgba(28,27,23,0.72)] [text-wrap:pretty]">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
