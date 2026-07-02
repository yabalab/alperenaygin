"use client";

import { useRef, type ReactNode } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Editorial heading reveal: the text rises out from behind a bottom mask
 * (overflow-clip + translateY) when it scrolls into view. Once, slow.
 * ScrollTrigger only *fires* it; the motion itself is a CSS transform
 * transition (composited — never stalls behind the page's backdrop-blurs).
 */
export default function MaskReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.querySelector<HTMLElement>("[data-mask-inner]");
      if (!inner) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        inner.style.transform = "none";
        return;
      }

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          inner.style.transform = "translateY(0)";
        },
      });
    },
    { scope: ref }
  );

  return (
    <h2 ref={ref} className={className}>
      {/* extra bottom room so descenders (g, ç, ş, ğ) aren't clipped at rest */}
      <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
        <span
          data-mask-inner
          className="block will-change-transform"
          style={{
            transform: "translateY(110%)",
            transition: "transform 1s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {children}
        </span>
      </span>
    </h2>
  );
}
