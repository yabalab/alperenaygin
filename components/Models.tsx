"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { revealProps } from "./reveal";

const CARDS = [
  {
    num: "01",
    title: "Ferah Tarama",
    img: "/images/model-ferah-tarama.png",
    alt: "Ferah Tarama modeli — french lace taban yapısı",
    desc: "Orta bölümü french lace. Kafa derin nefes alır, su geçirir. Ön 1 cm'lik bölüme ağartma uygulanır — saç çizgin doğal görünür. Tül, ölçüne göre kesilir.",
  },
  {
    num: "02",
    title: "Lux Protez",
    img: "/images/model-lux-protez.png",
    alt: "Lux Protez modeli — nanofilament tül taban",
    desc: "Tabanın tamamı nanofilament tül (France Lace). Baştan sona nefes alır. Ön 4 cm ağartılır. Ön tülde 1 cm'lik bölüm RSK tek düğümle işlenir — mümkün olan en doğal saç çizgisi.",
  },
  {
    num: "03",
    title: "Sil Baştan",
    img: "/images/model-sil-bastan.png",
    alt: "Sil Baştan modeli — full kalıp taban",
    desc: "Full kalıp. Komple/dengesiz dökülme, doğuştan saçsızlık, alopesi, radyoterapi sonrası dökülme, yanık ya da kafa şekli farklılıkları için. Alından enseye, şakaktan şakağa.",
  },
];

export default function Models() {
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
            Modeller
          </div>
          <h2 className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight [text-wrap:balance]">
            Üç yol. Hepsi kendi saçın.
          </h2>
          <p className="mt-5 font-body text-[clamp(17px,1.4vw,19.5px)] leading-[1.7] text-[rgba(28,27,23,0.78)] [text-wrap:pretty]">
            Hepsi %100 gerçek insan saçından, Kore işçiliği. Fark; taban yapısında
            ve doğallığın derecesinde.
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
                  {c.title}
                </h3>
                <p className="m-0 font-body text-[16.5px] leading-[1.65] text-[rgba(28,27,23,0.75)] [text-wrap:pretty]">
                  {c.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          {...revealProps}
          className="mt-[clamp(28px,4vw,40px)] text-center font-accent text-[clamp(16px,1.3vw,18px)] italic text-[rgba(28,27,23,0.62)]"
        >
          Hangisinin sana uyduğunu ön görüşmede birlikte kararlaştırırız.
        </motion.p>
      </div>
    </section>
  );
}
