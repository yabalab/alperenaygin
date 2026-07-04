"use client";

import { useActionState, useState } from "react";
import { updateContent, type UpdateContentState } from "@/app/yonetim/actions";
import { CMS_SECTIONS, type CmsSection } from "@/lib/cms/content";
import type { MediaRow } from "@/lib/cms/media";
import type { BeforeAfterRow } from "@/lib/cms/before-after";
import type { InstagramRow } from "@/lib/cms/instagram";
import ImageField from "./ImageField";
import HeroPairField from "./HeroPairField";
import BeforeAfterManager from "./BeforeAfterManager";
import InstagramManager from "./InstagramManager";

const initial: UpdateContentState = { ok: false, error: null };

// Per-section single-image slots. Hero is special (before/after pair — see below).
type MediaFieldDef = {
  alan: string;
  label: string;
  aspect: number;
  oran: string;
  fallbackSrc: string;
};
const MEDIA_FIELDS: Record<string, MediaFieldDef[]> = {
  usta: [
    { alan: "usta", label: "Portre", aspect: 3 / 4, oran: "3:4", fallbackSrc: "/images/alperen-portre.png" },
  ],
  atolye: [
    { alan: "atolye_lobi", label: "Lobi görseli", aspect: 16 / 10, oran: "16:10", fallbackSrc: "/images/atolye-lobi.png" },
    { alan: "atolye_oda", label: "Oda görseli", aspect: 16 / 10, oran: "16:10", fallbackSrc: "/images/atolye-oda.png" },
  ],
  modeller: [
    { alan: "model_1", label: "1. model görseli (Ferah Tarama)", aspect: 1, oran: "1:1", fallbackSrc: "/images/model-ferah-tarama.png" },
    { alan: "model_2", label: "2. model görseli (Lux Protez)", aspect: 1, oran: "1:1", fallbackSrc: "/images/model-lux-protez.png" },
    { alan: "model_3", label: "3. model görseli (Sil Baştan)", aspect: 1, oran: "1:1", fallbackSrc: "/images/model-sil-bastan.png" },
  ],
};

export default function ContentEditor({
  values,
  media,
  beforeAfter,
  instagram,
}: {
  values: Record<string, string>;
  media: Record<string, MediaRow>;
  beforeAfter: BeforeAfterRow[];
  instagram: InstagramRow[];
}) {
  const [activeId, setActiveId] = useState(CMS_SECTIONS[0].id);
  const active = CMS_SECTIONS.find((s) => s.id === activeId)!;
  const mediaFields = MEDIA_FIELDS[activeId] ?? [];

  return (
    <div>
      {/* Section tabs */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {CMS_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveId(s.id)}
            className={`shrink-0 rounded-full border px-3.5 py-2 font-body text-[13px] transition-colors ${
              activeId === s.id
                ? "border-ink-deep bg-ink-deep text-paper"
                : "border-ink-deep/15 text-ink-soft hover:bg-black/5"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Image slots for this section (media), above the text form. */}
      {activeId === "hero" && (
        <div className="mt-6">
          <HeroPairField
            kel={media.hero_kel ?? null}
            sacli={media.hero_sacli ?? null}
          />
        </div>
      )}
      {activeId === "kanit" && <BeforeAfterManager items={beforeAfter} />}
      {activeId === "instagram" && <InstagramManager items={instagram} />}
      {mediaFields.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          {mediaFields.map((m) => (
            <ImageField
              key={m.alan}
              alan={m.alan}
              label={m.label}
              aspect={m.aspect}
              oran={m.oran}
              current={media[m.alan] ?? null}
              fallbackSrc={m.fallbackSrc}
            />
          ))}
        </div>
      )}

      {/* Keyed so each section form remounts fresh (inputs + save state reset). */}
      <SectionForm key={active.id} section={active} values={values} />
    </div>
  );
}

function SectionForm({
  section,
  values,
}: {
  section: CmsSection;
  values: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(updateContent, initial);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5">
      <input type="hidden" name="sectionId" value={section.id} />

      {section.fields.map((f) => (
        <label key={f.key} className="flex flex-col gap-1.5">
          <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/60">
            {f.label}
          </span>
          {f.type === "textarea" ? (
            <textarea
              name={f.key}
              rows={3}
              defaultValue={values[f.key] ?? ""}
              className="w-full resize-y rounded-lg border border-ink-deep/15 bg-white px-3.5 py-2.5 font-body text-[15px] leading-relaxed outline-none transition-colors focus:border-gold"
            />
          ) : (
            <input
              type="text"
              name={f.key}
              defaultValue={values[f.key] ?? ""}
              className="w-full rounded-lg border border-ink-deep/15 bg-white px-3.5 py-2.5 font-body text-[15px] outline-none transition-colors focus:border-gold"
            />
          )}
        </label>
      ))}

      <div className="sticky bottom-4 flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-ink-deep px-6 py-3.5 font-body text-[13px] uppercase tracking-label text-paper shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {state.ok && (
          <span className="font-body text-[13px] text-emerald-700">
            Kaydedildi ✓
          </span>
        )}
        {state.error && (
          <span className="font-body text-[13px] text-rose-700">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}
