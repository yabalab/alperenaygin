"use client";

import ImageField from "./ImageField";
import { mediaSizeUrl, type MediaRow } from "@/lib/cms/media";

// Hero before/after pair. Both crop to the SAME 2:3 frame so they stay
// registered in the slider. The combined preview shows the slider's look at 50%
// (same object-position as the site) so alignment is obvious.
const OBJ_POS = "16% 22%"; // must match BeforeAfterSlider

export default function HeroPairField({
  kel,
  sacli,
}: {
  kel: MediaRow | null;
  sacli: MediaRow | null;
}) {
  const kelSrc = kel ? mediaSizeUrl(kel.storage_path, 800) : "/images/salon-kel.png";
  const sacliSrc = sacli
    ? mediaSizeUrl(sacli.storage_path, 800)
    : "/images/salon-sacli.png";

  return (
    <div className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
      <div className="mb-1 font-body text-[11px] uppercase tracking-label text-ink-soft/60">
        Hero — Önce / Sonra
      </div>
      <p className="mb-4 font-body text-[12px] text-ink-soft/50">
        İki görsel de aynı 2:3 çerçeveyle kırpılır. Slider&apos;da kafa oynamaması
        için ikisinde aynı kadrajı seçin. Aşağıda ortadan bölünmüş önizleme.
      </p>

      {/* Slider preview (before on left half, after underneath) */}
      <div
        className="relative mx-auto mb-5 w-40 overflow-hidden rounded-lg border border-ink-deep/15"
        style={{ aspectRatio: "2 / 3" }}
      >
        {/* eslint-disable @next/next/no-img-element */}
        <img
          src={sacliSrc}
          alt="Sonrası"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: OBJ_POS }}
        />
        <div className="absolute inset-0" style={{ clipPath: "inset(0 50% 0 0)" }}>
          <img
            src={kelSrc}
            alt="Öncesi"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: OBJ_POS }}
          />
        </div>
        {/* eslint-enable @next/next/no-img-element */}
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gold" />
        <span className="absolute bottom-1 left-1 rounded bg-paper/85 px-1.5 py-0.5 font-body text-[8px] uppercase tracking-label text-ink-soft">
          Önce
        </span>
        <span className="absolute bottom-1 right-1 rounded bg-paper/85 px-1.5 py-0.5 font-body text-[8px] uppercase tracking-label text-ink-soft">
          Sonra
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ImageField
          alan="hero_kel"
          label="Kel (öncesi)"
          aspect={2 / 3}
          oran="2:3"
          current={kel}
          fallbackSrc="/images/salon-kel.png"
        />
        <ImageField
          alan="hero_sacli"
          label="Saçlı (sonrası)"
          aspect={2 / 3}
          oran="2:3"
          current={sacli}
          fallbackSrc="/images/salon-sacli.png"
        />
      </div>
    </div>
  );
}
