"use client";

import { motion } from "framer-motion";
import { revealProps } from "./reveal";
import MaskReveal from "./MaskReveal";
import { useT } from "./cms/ContentProvider";

const STEPS = [
  { num: "01", titleKey: "surec.s1_title", descKey: "surec.s1_desc", gold: false },
  { num: "02", titleKey: "surec.s2_title", descKey: "surec.s2_desc", gold: false },
  { num: "03", titleKey: "surec.s3_title", descKey: "surec.s3_desc", gold: false },
  { num: "04", titleKey: "surec.s4_title", descKey: "surec.s4_desc", gold: true },
];

export default function Process() {
  const t = useT();
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
            {t("surec.eyebrow")}
          </div>
          <MaskReveal className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight [text-wrap:balance]">
            {t("surec.title")}
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
                {t(s.titleKey)}
              </h3>
              <p className="m-0 font-body text-[16.5px] leading-[1.6] text-[rgba(28,27,23,0.72)] [text-wrap:pretty]">
                {t(s.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
