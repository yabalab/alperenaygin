"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { revealProps } from "./reveal";
import MaskReveal from "./MaskReveal";
import { useT } from "./cms/ContentProvider";
import { useMedia } from "./cms/MediaProvider";
import { mediaFill } from "@/lib/cms/media";

const POINTS = [
  { num: "01", titleKey: "atolye.p1_title", descKey: "atolye.p1_desc" },
  { num: "02", titleKey: "atolye.p2_title", descKey: "atolye.p2_desc" },
];

export default function Studio() {
  const t = useT();
  const PHOTOS = [
    {
      ...mediaFill(useMedia("atolye_lobi"), "/images/atolye-lobi.png"),
      alt: "Yeni atölyenin ferah lobisi — kemerli nişler ve altın çerçeveli ayna",
    },
    {
      ...mediaFill(useMedia("atolye_oda"), "/images/atolye-oda.png"),
      alt: "Kapalı özel uygulama odası — loş ve sakin istasyon",
    },
  ];
  return (
    <section
      id="atolye"
      aria-label="Atölye"
      className="bg-ink-deep py-[42px] px-[clamp(22px,5vw,64px)] md:py-[clamp(68px,10vw,128px)]"
    >
      <div className="mx-auto grid max-w-[1160px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-[clamp(40px,6vw,90px)]">
        {/* Left: copy */}
        <motion.div {...revealProps}>
          <div className="mb-4 h-px w-[30px] bg-gold" />
          <div className="font-body text-[10.5px] font-light uppercase tracking-label text-gold">
            {t("atolye.eyebrow")}
          </div>
          <MaskReveal className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight text-paper [text-wrap:balance]">
            {t("atolye.title")}
          </MaskReveal>
          <p className="mt-[22px] max-w-[48ch] font-body text-[clamp(17px,1.4vw,19.5px)] leading-[1.75] text-[rgba(244,239,230,0.78)] [text-wrap:pretty]">
            {t("atolye.paragraph1")}
          </p>
          <p className="mt-[14px] max-w-[48ch] font-body text-[clamp(17px,1.4vw,19.5px)] leading-[1.75] text-[rgba(244,239,230,0.78)] [text-wrap:pretty]">
            {t("atolye.paragraph2")}
          </p>

          {POINTS.map((p, i) => (
            <div
              key={p.num}
              className={`flex items-baseline gap-4 border-t border-[rgba(244,239,230,0.14)] pt-5 ${
                i === 0 ? "mt-[30px]" : "mt-4"
              }`}
            >
              <span className="flex-none font-body text-[10px] font-light uppercase tracking-label text-gold">
                {p.num}
              </span>
              <p className="m-0 text-[16.5px] leading-[1.6]">
                <strong className="font-display font-medium text-paper">
                  {t(p.titleKey)}
                </strong>{" "}
                <span className="font-body text-[rgba(244,239,230,0.66)]">
                  {t(p.descKey)}
                </span>
              </p>
            </div>
          ))}
        </motion.div>

        {/* Right: photos */}
        <motion.div {...revealProps} className="flex flex-col gap-[18px]">
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[6px] border border-[rgba(244,239,230,0.12)]"
            >
              <Image
                src={photo.src}
                loader={photo.loader}
                alt={photo.alt}
                fill
                sizes="(min-width: 960px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
