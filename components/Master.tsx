"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { revealProps } from "./reveal";

export default function Master() {
  return (
    <section
      id="usta"
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
            className="absolute bottom-0 left-[2%] right-[2%] top-[8%] rounded-b-[12px] rounded-t-[999px] border border-[rgba(184,149,106,0.22)]"
            style={{
              background: "linear-gradient(180deg,#EFE7D8 0%,#EAE0CF 100%)",
              boxShadow: "0 26px 60px -34px rgba(138,111,79,0.42)",
            }}
          />
          <Image
            src="/images/alperen-portre.png"
            alt="Alperen Aygın — kollar kavuşturulmuş portre"
            width={1024}
            height={1536}
            className="relative z-[1] block h-auto w-full"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom,#000 80%,transparent 100%)",
              maskImage: "linear-gradient(to bottom,#000 80%,transparent 100%)",
            }}
          />
        </motion.div>

        {/* Quote */}
        <motion.div {...revealProps} className="pb-[clamp(8px,2vw,36px)]">
          <div className="mb-4 h-px w-[30px] bg-gold" />
          <div className="font-body text-[10.5px] font-light uppercase tracking-label text-clay">
            Usta
          </div>
          <h2 className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight [text-wrap:balance]">
            İşi yapan el.
          </h2>
          <blockquote className="m-0 mt-[26px] p-0">
            <p className="m-0 max-w-[44ch] font-body text-[clamp(18px,1.6vw,22px)] leading-[1.7] text-[rgba(28,27,23,0.82)] [text-wrap:pretty]">
              {"[X] yıldır aynı işi yapıyorum: Serdivan'da, küçük bir atölyede, tek tek."}
            </p>
            <p className="mt-[14px] max-w-[44ch] font-body text-[clamp(18px,1.6vw,22px)] leading-[1.7] text-[rgba(28,27,23,0.82)] [text-wrap:pretty]">
              {'Kimseye "şunu da al" demem. Sana ne yakışıyorsa onu konuşuruz. Ölçü doğruysa, gerisi kendiliğinden gelir.'}
            </p>
            <footer className="mt-6 flex items-center gap-[14px]">
              <span className="h-px w-[26px] bg-gold" />
              <cite className="font-body text-[10.5px] font-light not-italic uppercase tracking-label text-ink-soft">
                Alperen Aygın
              </cite>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
