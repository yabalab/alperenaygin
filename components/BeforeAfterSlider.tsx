"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const EASE = "cubic-bezier(0.16,1,0.3,1)";
// Auto (scroll-driven) sweep range for the handle: starts at 65% on load and
// drifts to 40% (right→left) over a short early scroll, not the whole hero.
const START = 65;
const END = 40;
// Scroll distance over which the sweep completes (hero is still on screen).
const SWEEP_PX = 100;
// Fixed-header spacer height — the slider box starts this far down, so we offset
// the trigger by it to make the sweep run over scroll 0 → SWEEP_PX (no dead zone).
const HEADER_OFFSET = 64;

type Props = {
  /** Image shown on the right / underneath (the "after" state). */
  afterSrc: string;
  afterAlt: string;
  /** Image revealed from the left (the "before" state). */
  beforeSrc: string;
  beforeAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  showLabels?: boolean;
  /** Shared object-position so before/after stay perfectly registered. */
  objectPosition?: string;
  className?: string;
};

export default function BeforeAfterSlider({
  afterSrc,
  afterAlt,
  beforeSrc,
  beforeAlt,
  beforeLabel = "ÖNCE",
  afterLabel = "SONRA",
  showLabels = true,
  objectPosition = "16% 22%",
  className = "",
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [userTook, setUserTook] = useState(false);

  // Refs for the GSAP-driven auto behaviour (read inside GSAP callbacks).
  const userTookRef = useRef(false);
  const introDoneRef = useRef(false);
  const introTweenRef = useRef<gsap.core.Tween | null>(null);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);

  // The moment the user touches the slider (drag or keyboard), auto is off for
  // good — the slider is theirs.
  const takeControl = () => {
    if (userTookRef.current) return;
    userTookRef.current = true;
    setUserTook(true);
    introTweenRef.current?.kill();
    scrollTweenRef.current?.scrollTrigger?.kill();
    scrollTweenRef.current?.kill();
  };

  // Auto-slide: intro glide (0→START) then scroll-scrubbed sweep (START→END)
  // while the hero is on screen. Skipped for reduced-motion.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPos(50); // static, both halves visible; slider still draggable
        return;
      }

      const intro = { p: 0 };
      introTweenRef.current = gsap.to(intro, {
        p: START,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.25,
        onUpdate: () => {
          if (!userTookRef.current) setPos(intro.p);
        },
        onComplete: () => {
          introDoneRef.current = true;
        },
      });

      const scroll = { p: 0 };
      scrollTweenRef.current = gsap.to(scroll, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: boxRef.current,
          start: `top top+=${HEADER_OFFSET}`, // begins at scroll 0
          end: `top+=${SWEEP_PX} top+=${HEADER_OFFSET}`, // done by ~SWEEP_PX scroll
          scrub: 0.7, // higher smoothing so the ~100px trigger eases out over a
          // few hundred ms — fast but never snappy
        },
        onUpdate: () => {
          // User priority + don't fight the intro; stop once hero has left
          // (ScrollTrigger clamps progress outside its range on its own).
          if (userTookRef.current || !introDoneRef.current) return;
          setPos(START + (END - START) * scroll.p);
        },
      });
    },
    { scope: boxRef }
  );

  const posFrom = (clientX: number) => {
    const box = boxRef.current;
    if (!box) return pos;
    const r = box.getBoundingClientRect();
    return Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100));
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) return;
    takeControl();
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setDragging(true);
    setPos(posFrom(e.clientX));
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) setPos(posFrom(e.clientX));
  };

  const onUp = () => setDragging(false);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    takeControl();
    e.preventDefault();
    const d = e.key === "ArrowLeft" ? -4 : 4;
    setPos((p) => Math.max(2, Math.min(98, p + d)));
  };

  const clipRight = 100 - pos;
  // No CSS transition while auto-driving (GSAP scrub already smooths) or while
  // dragging; once the user owns it, keyboard nudges ease over 1.5s.
  const useTrans = userTook && !dragging;
  const clipTrans = useTrans ? `clip-path 1.5s ${EASE}` : "none";
  const leftTrans = useTrans ? `left 1.5s ${EASE}` : "none";

  return (
    <div
      ref={boxRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className={`relative w-full cursor-ew-resize touch-pan-y select-none overflow-hidden ${className}`}
    >
      {/* AFTER — underneath, full frame */}
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        priority
        draggable={false}
        sizes="(min-width: 960px) 50vw, 100vw"
        className="object-cover"
        style={{ objectPosition }}
      />

      {/* BEFORE — clipped from the right, revealed on the left */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${clipRight}% 0 0)`, transition: clipTrans }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          priority
          draggable={false}
          sizes="(min-width: 960px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>

      {/* Handle */}
      <div
        className="absolute bottom-0 top-0 z-[3] w-0"
        style={{ left: `${pos}%`, transition: leftTrans }}
      >
        <div
          className="absolute bottom-0 top-0 w-px"
          style={{
            left: "-0.5px",
            background:
              "linear-gradient(to bottom, rgba(184,149,106,0) 0%, rgba(184,149,106,0.9) 12%, rgba(184,149,106,0.9) 88%, rgba(184,149,106,0) 100%)",
          }}
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Önce ve sonra karşılaştırma"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKey}
          className="absolute left-0 top-1/2 flex h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center gap-[7px] rounded-full border border-gold bg-[rgba(244,239,230,0.88)] outline-none backdrop-blur-[8px]"
          style={{ boxShadow: "0 6px 24px rgba(14,14,12,0.16)" }}
        >
          <span className="text-[13px] leading-none text-ink-soft">‹</span>
          <span className="h-[14px] w-px bg-[rgba(184,149,106,0.7)]" />
          <span className="text-[13px] leading-none text-ink-soft">›</span>
        </div>
      </div>

      {showLabels && (
        <>
          <div className="pointer-events-none absolute bottom-[14px] left-[14px] z-[2] rounded-full border border-[rgba(184,149,106,0.35)] bg-[rgba(244,239,230,0.72)] px-3 pb-[5px] pt-[6px] font-body text-[9.5px] font-light uppercase tracking-label text-ink-soft backdrop-blur-[6px]">
            {beforeLabel}
          </div>
          <div className="pointer-events-none absolute bottom-[14px] right-[14px] z-[2] rounded-full border border-[rgba(184,149,106,0.35)] bg-[rgba(244,239,230,0.72)] px-3 pb-[5px] pt-[6px] font-body text-[9.5px] font-light uppercase tracking-label text-ink-soft backdrop-blur-[6px]">
            {afterLabel}
          </div>
        </>
      )}
    </div>
  );
}
