"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { revealProps } from "./reveal";
import MaskReveal from "./MaskReveal";
import { useT } from "./cms/ContentProvider";

const CARDS = [
  {
    num: "01",
    titleKey: "modeller.m1_title",
    img: "/images/model-ferah-tarama.png",
    alt: "Ferah Tarama modeli — french lace taban yapısı",
    descKey: "modeller.m1_desc",
  },
  {
    num: "02",
    titleKey: "modeller.m2_title",
    img: "/images/model-lux-protez.png",
    alt: "Lux Protez modeli — nanofilament tül taban",
    descKey: "modeller.m2_desc",
  },
  {
    num: "03",
    titleKey: "modeller.m3_title",
    img: "/images/model-sil-bastan.png",
    alt: "Sil Baştan modeli — full kalıp taban",
    descKey: "modeller.m3_desc",
  },
];

export default function Models() {
  const t = useT();
  return (
    <section
      id="modeller"
      aria-label="Modeller"
      className="bg-paper py-[42px] px-[clamp(22px,5vw,64px)] md:py-[clamp(68px,10vw,128px)]"
    >
      <div className="mx-auto max-w-[1160px]">
        <motion.div {...revealProps} className="max-w-[680px]">
          <div className="mb-4 h-px w-[30px] bg-gold" />
          <div className="font-body text-[10.5px] font-light uppercase tracking-label text-clay">
            {t("modeller.eyebrow")}
          </div>
          <MaskReveal className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight [text-wrap:balance]">
            {t("modeller.title")}
          </MaskReveal>
          <p className="mt-5 font-body text-[clamp(17px,1.4vw,19.5px)] leading-[1.7] text-[rgba(28,27,23,0.78)] [text-wrap:pretty]">
            {t("modeller.intro")}
          </p>
        </motion.div>

        <div className="mt-[clamp(36px,5vw,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(20px,3vw,32px)]">
          {CARDS.map((c) => (
            <motion.article
              key={c.num}
              {...revealProps}
              className="flex flex-col overflow-hidden rounded-[3px] border border-[rgba(35,28,20,0.08)] bg-card-cream"
            >
              <div className="flex items-center justify-center bg-card-cream px-10 pb-[34px] pt-10">
                <Image
                  src={c.img}
                  alt={c.alt}
                  width={224}
                  height={224}
                  className="block aspect-square w-full max-w-[224px] object-contain mix-blend-multiply"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 border-t border-[rgba(14,14,12,0.06)] px-[26px] pb-[30px] pt-[22px]">
                <div className="font-body text-[10px] font-light uppercase tracking-label text-clay">
                  {c.num}
                </div>
                <h3 className="m-0 font-display text-[clamp(21px,1.8vw,24px)] font-[480] leading-[1.15]">
                  {t(c.titleKey)}
                </h3>
                <p className="m-0 font-body text-[16.5px] leading-[1.65] text-[rgba(28,27,23,0.75)] [text-wrap:pretty]">
                  {t(c.descKey)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          {...revealProps}
          className="mt-[clamp(28px,4vw,40px)] text-center font-accent text-[clamp(16px,1.3vw,18px)] italic text-[rgba(28,27,23,0.62)]"
        >
          {t("modeller.footnote")}
        </motion.p>
      </div>
    </section>
  );
}
