"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { revealProps } from "./reveal";

const IG_URL = "https://instagram.com/alperenayginhairstudio";

export default function Proof() {
  return (
    <section
      id="kanit"
      aria-label="Kanıt"
      className="border-t border-[rgba(14,14,12,0.06)] bg-paper-cool py-[42px] px-[clamp(22px,5vw,64px)] md:py-[clamp(68px,10vw,128px)]"
    >
      <div className="mx-auto max-w-[1160px]">
        {/* Header */}
        <motion.div {...revealProps} className="max-w-[640px]">
          <div className="mb-4 h-px w-[30px] bg-gold" />
          <div className="font-body text-[10.5px] font-light uppercase tracking-label text-clay">
            Uygulamalarımız
          </div>
          <h2 className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight [text-wrap:balance]">
            Öncesi ve sonrası
          </h2>
          <p className="mt-5 font-body text-[clamp(17px,1.4vw,19.5px)] leading-[1.7] text-[rgba(28,27,23,0.78)] [text-wrap:pretty]">
            Aşağıdakiler gerçek. Kadraj her zaman kusursuz değil — çünkü bunlar
            stüdyo değil, atölye.
          </p>
        </motion.div>

        {/* Polaroid pair */}
        <div className="mt-[clamp(44px,6vw,72px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(28px,4vw,44px)]">
          <motion.figure
            {...revealProps}
            className="m-0 flex flex-col items-center"
          >
            <div className="relative aspect-[1/1.16] w-[min(100%,380px)]">
              {/* back — öncesi */}
              <div
                className="absolute left-0 top-[6%] box-border w-[76%] rotate-[-4.5deg] border border-[rgba(14,14,12,0.05)] bg-white p-[10px] pb-[40px]"
                style={{ boxShadow: "0 10px 28px rgba(14,14,12,0.14)" }}
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src="/images/ba1-once.png"
                    alt="Uygulama öncesi"
                    fill
                    draggable={false}
                    sizes="(min-width: 960px) 300px, 60vw"
                    className="object-cover"
                  />
                </div>
                <span className="absolute bottom-[11px] left-3 font-body text-[9px] font-light uppercase tracking-label text-[rgba(28,27,23,0.55)]">
                  Öncesi
                </span>
              </div>

              {/* front — sonrası */}
              <div
                className="absolute right-0 top-0 box-border w-[78%] rotate-[5deg] border border-[rgba(14,14,12,0.05)] bg-white p-[10px] pb-[42px]"
                style={{ boxShadow: "0 16px 38px rgba(14,14,12,0.2)" }}
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src="/images/ba1-sonra.png"
                    alt="Uygulama sonrası — saç sistemi uygulanmış"
                    fill
                    draggable={false}
                    sizes="(min-width: 960px) 300px, 60vw"
                    className="object-cover"
                  />
                </div>
                <span className="absolute bottom-[12px] left-3 font-body text-[9px] font-light uppercase tracking-label text-clay">
                  Sonrası
                </span>
              </div>
            </div>
            <figcaption className="mt-[18px] text-center font-accent text-[15.5px] italic text-[rgba(28,27,23,0.68)]">
              [Mehmet, 34 — bir öğle arasında]
            </figcaption>
          </motion.figure>
        </div>

        <motion.p {...revealProps} className="mt-[clamp(28px,4vw,40px)] text-center">
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener"
            className="border-b border-[rgba(184,149,106,0.55)] pb-1 font-body text-[10.5px] font-light uppercase tracking-label text-ink-soft transition-colors duration-[400ms] hover:text-clay"
          >
            Daha fazlası Instagram&apos;da →{" "}
            {/* handle is an address, exempt from Turkish uppercasing */}
            <span className="normal-case">@alperenayginhairstudio</span>
          </a>
        </motion.p>
      </div>
    </section>
  );
}
