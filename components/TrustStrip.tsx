"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useT } from "./cms/ContentProvider";

// Güven şeridi — a large, flowing editorial line under the hero.
// Numeric items count up on reveal; plain items stay as-is.
type Item =
  | string
  | { prefix?: string; count: number; suffix?: string };

const numberCls = "font-display text-[clamp(16px,2.1vw,25px)] font-[380] text-ink-soft";

export default function TrustStrip() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Editable text from the CMS; the year still counts up (falls back to plain
  // text if a non-number is entered).
  const years = Number(t("trust.years"));
  const ITEMS: Item[] = [
    Number.isFinite(years)
      ? { prefix: "", count: years, suffix: " yıl" }
      : `${t("trust.years")} yıl`,
    t("trust.item2"),
    { prefix: "%", count: 100, suffix: ` ${t("trust.material")}` },
    t("trust.item4"),
  ];

  // Count-up — wall-clock rAF (finishes in a fixed time regardless of frame
  // rate, unlike a per-frame tween which the page's backdrop-blurs can stall).
  useEffect(() => {
    const els = Array.from(
      sectionRef.current?.querySelectorAll<HTMLElement>("[data-count]") ?? []
    );
    if (els.length === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = (el: HTMLElement) => {
      const target = Number(el.getAttribute("data-count"));
      if (reduce) {
        el.textContent = String(target);
        return;
      }
      const dur = 1400;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 2); // ease-out
        el.textContent = String(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            io.unobserve(e.target);
            run(e.target as HTMLElement);
          }
        });
      },
      { threshold: 1 }
    );
    els.forEach((el) => {
      el.textContent = reduce ? el.textContent : "0";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Subtle horizontal drift (scroll down → left, up → right). scrub = idle at
  // rest, so it never taxes the main thread when you're not scrolling.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const d = { p: 0 };
      gsap.to(d, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
        onUpdate: () => {
          const el = trackRef.current;
          if (el) el.style.transform = `translateX(${(0.5 - d.p) * 100}px)`;
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Güven şeridi"
      className="relative overflow-hidden border-y border-[rgba(14,14,12,0.07)] bg-paper-warm py-[clamp(20px,3vw,34px)]"
    >
      {/* soft edge fades (cheap overlays, not a content mask) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper-warm to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper-warm to-transparent" />

      <div className="flex justify-center">
        <div
          ref={trackRef}
          className="flex w-max items-baseline gap-x-[clamp(16px,2.2vw,30px)] whitespace-nowrap px-6"
        >
          {ITEMS.map((item, i) => (
            <span
              key={i}
              className="flex items-baseline gap-x-[clamp(16px,2.2vw,30px)]"
            >
              {typeof item === "string" ? (
                <span className={numberCls}>{item}</span>
              ) : (
                <span className={numberCls}>
                  {item.prefix}
                  {/* fixed width so counting never reflows the strip */}
                  <span
                    data-count={item.count}
                    className="inline-block text-left tabular-nums"
                    style={{ minWidth: `${String(item.count).length}ch` }}
                  >
                    {item.count}
                  </span>
                  {item.suffix}
                </span>
              )}
              {i < ITEMS.length - 1 && (
                <span
                  aria-hidden
                  className="font-display text-[clamp(16px,2.1vw,24px)] leading-none text-gold"
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
