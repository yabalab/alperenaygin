"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { revealProps } from "./reveal";

const IG_URL = "https://instagram.com/alperenayginhairstudio";

// Order mirrors the reference's igBase array exactly.
const TILES = [
  { src: "/images/ba1-sonra.png", alt: "Uygulama sonrası" },
  { src: "/images/salon-sacli.png", alt: "Saç sistemi sonrası salon çekimi" },
  { src: "/images/atolye-lobi.png", alt: "Atölye lobisi" },
  { src: "/images/ba1-once.png", alt: "Uygulama öncesi" },
  { src: "/images/alperen-portre.png", alt: "Alperen Aygın" },
  { src: "/images/atolye-oda.png", alt: "Özel uygulama odası" },
  { src: "/images/salon-kel.png", alt: "Uygulama öncesi salon çekimi" },
  { src: "/images/ba1-full.jpg", alt: "Öncesi ve sonrası" },
];

export default function InstagramMarquee() {
  // Duplicated so the -50% marquee translate loops seamlessly.
  const loop = [...TILES, ...TILES];

  return (
    <section
      aria-label="Instagram bandı"
      className="overflow-hidden bg-paper-cool pb-[clamp(56px,8vw,88px)]"
    >
      <motion.div {...revealProps}>
        <p className="mx-[22px] mb-[clamp(22px,3vw,32px)] text-center font-body text-[10px] font-light uppercase tracking-label text-clay">
          Instagram ·{" "}
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener"
            className="border-b border-[rgba(184,149,106,0.5)] normal-case text-clay transition-colors hover:text-gold"
          >
            @alperenayginhairstudio
          </a>
        </p>

        <div className="w-full overflow-hidden">
          <div className="flex w-max animate-marquee gap-[14px]">
            {loop.map((tile, i) => (
              <a
                key={`${tile.src}-${i}`}
                href={IG_URL}
                target="_blank"
                rel="noopener"
                aria-label="Instagram — @alperenayginhairstudio"
                className="group relative block aspect-square w-[clamp(150px,18vw,220px)] flex-none overflow-hidden rounded-[4px] border border-[rgba(14,14,12,0.08)]"
              >
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  fill
                  draggable={false}
                  sizes="clamp(150px,18vw,220px)"
                  className="object-cover transition-transform duration-[800ms] ease-smooth group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
