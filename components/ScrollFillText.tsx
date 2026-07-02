"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Signature effect (used ONCE, on the "Duş al…" slogan): splits text into
 * per-letter spans and fills their colour left-to-right, scrubbed to scroll —
 * faint → solid as the line travels up through the viewport. No GSAP SplitText;
 * the split is done here by hand.
 */
type Props = {
  text: string;
  className?: string;
  /** faint starting colour */
  from?: string;
  /** solid fill colour */
  to?: string;
};

export default function ScrollFillText({
  text,
  className = "",
  from = "rgba(28,27,23,0.2)",
  to = "#0E0E0C",
}: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const chars = ref.current?.querySelectorAll<HTMLElement>("[data-char]");
      if (!chars || chars.length === 0) return;

      // Respect reduced-motion: land on the final colour, no scrubbing.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(chars, { color: to });
        return;
      }

      gsap.fromTo(
        chars,
        { color: from },
        {
          color: to,
          ease: "none",
          duration: 1,
          stagger: { each: 0.4 }, // soft wave, letters overlap slightly
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.6, // follows scroll up/down, smoothed so it never jitters
          },
        }
      );
    },
    { scope: ref }
  );

  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {/* inline-block keeps a word intact across line wraps */}
          <span className="inline-block">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} data-char style={{ color: from }}>
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
