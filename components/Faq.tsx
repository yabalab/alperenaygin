"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { revealProps } from "./reveal";

// Questions & answers verbatim from the reference (faqData in dist/index.html).
const FAQS = [
  {
    q: "Acıyor mu?",
    a: "Hayır. Cerrahi bir işlem değil. Ağrı ya da sızı hissetmezsin.",
  },
  {
    q: "Fark edilir mi? Doğal duruyor mu?",
    a: "Saç çizgisi ağartma ve tek düğüm teknikleriyle hazırlanır. Yakından bile ayırmak zordur.",
  },
  {
    q: "Ne kadar sürüyor?",
    a: "Uygulama iki-üç saat. Ön görüşme bir saat.",
  },
  {
    q: "Kendi saçıma zarar verir mi?",
    a: "Vermez. Kafa derin hava alır, terletmez.",
  },
  {
    q: "Suyla arası nasıl?",
    a: "Sorun değil. Yıkarsın, denize girersin, fön çekersin.",
  },
  {
    q: "Ne sıklıkla bakım?",
    a: "[3-4 haftada bir — netleşecek]. Bakımı biz yaparız.",
  },
  {
    q: "Fiyat?",
    a: "Modele ve ölçüye göre değişir. Net rakamı ön görüşmede konuşuruz. Bakım [₺1.000].",
  },
  {
    q: "Gizli kalır mı?",
    a: "Atölye randevuyla çalışır ve ayrı odaları var. Kapalı bir odada tek tek ilgileniriz. Kimse görmeden gelir, kimse anlamadan gidersin.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(-1);

  return (
    <section
      id="sss"
      aria-label="SSS"
      className="border-t border-[rgba(14,14,12,0.06)] bg-paper-cool py-[42px] px-[clamp(22px,5vw,64px)] md:py-[clamp(68px,10vw,128px)]"
    >
      <div className="mx-auto max-w-[820px]">
        <motion.div {...revealProps}>
          <div className="mb-4 h-px w-[30px] bg-gold" />
          <div className="font-body text-[10.5px] font-light uppercase tracking-label text-clay">
            Sık Sorulanlar
          </div>
          <h2 className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight [text-wrap:balance]">
            Aklındakiler.
          </h2>
        </motion.div>

        <motion.div
          {...revealProps}
          className="mt-[clamp(30px,4vw,48px)] border-t border-[rgba(14,14,12,0.14)]"
        >
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-[rgba(14,14,12,0.14)]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-5 border-none bg-transparent px-[2px] py-[26px] text-left outline-none focus-visible:bg-[rgba(184,149,106,0.08)]"
                >
                  <span className="font-body text-[clamp(17px,1.5vw,20px)] font-medium leading-[1.35] text-ink-deep">
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className="relative h-[34px] w-[34px] flex-none rounded-full border-[1.5px] border-[rgba(138,111,79,0.6)] transition-transform duration-[600ms] ease-smooth"
                    style={{ transform: isOpen ? "rotate(45deg)" : undefined }}
                  >
                    <span className="absolute left-1/2 top-1/2 h-[1.5px] w-[13px] -translate-x-1/2 -translate-y-1/2 bg-clay" />
                    <span className="absolute left-1/2 top-1/2 h-[13px] w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-clay" />
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-[600ms] ease-smooth"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="m-0 pb-[22px] pl-[2px] pr-[44px] font-body text-[clamp(16.5px,1.4vw,18.5px)] leading-[1.7] text-[rgba(28,27,23,0.75)] [text-wrap:pretty]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
