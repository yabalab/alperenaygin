"use client";

import Image from "next/image";
import type { ProofItem } from "@/lib/proof-items";
import { mediaLoader } from "@/lib/cms/media";

/**
 * A before/after polaroid pair. Three composed transform layers so the effects
 * never fight each other:
 *   layer 1 `.proof-drift-*`  — scroll drift (GSAP animates `--drift`)
 *   layer 2 `.proof-entry-*`  — slide-in when the slide becomes active (CSS)
 *   layer 3 (rotated card)     — hover "open" (Tailwind group-hover transform)
 */
export default function ProofCard({
  item,
  index,
}: {
  item: ProofItem;
  index: number;
}) {
  return (
    <figure className="m-0 flex flex-col items-center">
      {/* click handled by delegation on the parent (survives Swiper loop clones) */}
      <div
        data-proof-index={index}
        className="proof-card group relative aspect-[1/1.16] w-[min(100%,380px)] cursor-zoom-in"
      >
        {/* before — back, revealed on the left */}
        <div
          className="proof-drift-before absolute left-0 top-[6%] w-[76%]"
          style={{ transform: "translateX(calc(-20px * var(--drift, 0)))" }}
        >
          <div className="proof-entry-before">
            <div
              className="box-border rotate-[-4.5deg] border border-[rgba(14,14,12,0.05)] bg-white p-[10px] pb-[40px] transition-transform duration-[600ms] ease-smooth group-hover:-translate-x-[26%] group-hover:-rotate-[7deg]"
              style={{ boxShadow: "0 10px 28px rgba(14,14,12,0.14)" }}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={item.before}
                  loader={item.remote ? mediaLoader : undefined}
                  alt={item.beforeAlt}
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
          </div>
        </div>

        {/* after — front, on top */}
        <div
          className="proof-drift-after absolute right-0 top-0 w-[78%]"
          style={{ transform: "translateX(calc(20px * var(--drift, 0)))" }}
        >
          <div className="proof-entry-after">
            <div
              className="box-border rotate-[5deg] border border-[rgba(14,14,12,0.05)] bg-white p-[10px] pb-[42px] transition-transform duration-[600ms] ease-smooth group-hover:translate-x-[8%] group-hover:rotate-[3deg]"
              style={{ boxShadow: "0 16px 38px rgba(14,14,12,0.2)" }}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={item.after}
                  loader={item.remote ? mediaLoader : undefined}
                  alt={item.afterAlt}
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
        </div>
      </div>

      <figcaption className="mt-[18px] text-center font-accent text-[15.5px] italic text-[rgba(28,27,23,0.68)]">
        {item.caption}
      </figcaption>
    </figure>
  );
}
