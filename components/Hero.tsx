"use client";

import { motion, type Variants } from "framer-motion";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { useT, MultiLine } from "./cms/ContentProvider";
import { useMedia } from "./cms/MediaProvider";
import { mediaFill } from "@/lib/cms/media";

const WA = "https://wa.me/905354838997";
const PHONE = "+905354838997";

// Staggered fade-up matching the reference's aaFadeUp keyframe (10px, 0.9s,
// cubic-bezier(0.16,1,0.3,1)) with the same per-element delays.
const reveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

export default function Hero() {
  const t = useT();
  const sacli = mediaFill(useMedia("hero_sacli"), "/images/salon-sacli.png");
  const kel = mediaFill(useMedia("hero_kel"), "/images/salon-kel.png");
  return (
    <section
      id="hero"
      className="relative flex flex-col overflow-hidden desk:grid desk:max-h-[960px] desk:min-h-[calc(100svh-64px)] desk:grid-cols-2"
    >
      <BeforeAfterSlider
        afterSrc={sacli.src}
        afterLoader={sacli.loader}
        afterAlt="Saç sistemi uygulanmış hali — aynı adam, saçlı"
        beforeSrc={kel.src}
        beforeLoader={kel.loader}
        beforeAlt="Saç sistemi öncesi — kel hali"
        className="aspect-[1/1.02] desk:aspect-auto desk:h-full desk:min-h-[620px]"
      />

      <div className="box-border px-6 pb-12 pt-8 desk:flex desk:flex-col desk:justify-center desk:self-center desk:px-[clamp(36px,5vw,92px)] desk:py-12">
        <motion.div initial="hidden" animate="show" custom={0.1} variants={reveal}>
          <div className="mb-4 h-px w-[30px] bg-gold" />
          <div className="font-body text-[10.5px] font-light uppercase tracking-label text-clay">
            {t("hero.eyebrow")}
          </div>
        </motion.div>

        <motion.div
          role="heading"
          aria-level={2}
          initial="hidden"
          animate="show"
          custom={0.25}
          variants={reveal}
          className="mt-5 font-display text-[clamp(31px,3.4vw,48px)] font-[360] leading-[1.04] tracking-tight [text-wrap:balance]"
        >
          <span className="block [text-wrap:balance]">{t("hero.title1")}</span>
          <span className="block text-[rgba(14,14,12,0.62)] [text-wrap:balance]">
            {t("hero.title2")}
          </span>
        </motion.div>

        <motion.p
          initial="hidden"
          animate="show"
          custom={0.4}
          variants={reveal}
          className="mt-5 max-w-[42ch] font-accent text-[clamp(17px,1.4vw,20px)] italic leading-[1.6] text-[rgba(28,27,23,0.78)] [text-wrap:pretty]"
        >
          <MultiLine text={t("hero.subtitle")} />
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={0.55}
          variants={reveal}
          className="mt-[30px] flex flex-wrap items-center gap-3"
        >
          <a
            href="#randevu"
            className="inline-flex items-center gap-[10px] rounded-full bg-ink-deep px-[26px] pb-4 pt-[17px] font-body text-[10.5px] font-light uppercase tracking-label text-paper transition-colors duration-500 ease-smooth hover:bg-clay"
          >
            Ön görüşme al{" "}
            <span className="font-accent text-[15px] tracking-normal">→</span>
          </a>
          <a
            href={WA}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center rounded-full border border-[rgba(14,14,12,0.3)] bg-transparent px-6 pb-[15px] pt-4 font-body text-[10.5px] font-light uppercase tracking-label text-ink-soft transition-colors duration-500 ease-smooth hover:border-gold hover:text-clay"
          >
            WhatsApp&apos;tan yaz
          </a>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          custom={0.7}
          variants={reveal}
          className="mt-[22px]"
        >
          <a
            href={`tel:${PHONE}`}
            className="border-b border-[rgba(184,149,106,0.5)] pb-[3px] font-body text-[10px] font-light uppercase tracking-label text-[rgba(28,27,23,0.62)] transition-colors hover:text-clay"
          >
            Ya da ara: 0 535 483 89 97
          </a>
        </motion.div>
      </div>
    </section>
  );
}
