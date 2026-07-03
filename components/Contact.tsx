"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { revealProps } from "./reveal";
import MaskReveal from "./MaskReveal";
import StyledMap from "./StyledMap";
import { useT, MultiLine } from "./cms/ContentProvider";

const WA = "https://wa.me/905354838997";
const TEL = "tel:+905354838997";
const IG = "https://instagram.com/alperenayginhairstudio";
const MAIL = "mailto:alperenaygin21@gmail.com";

const DAYS = ["Hafta içi", "Hafta sonu", "Fark etmez"];

const inputCls =
  "w-full box-border rounded-none border-0 border-b border-[rgba(14,14,12,0.28)] bg-transparent px-[2px] py-[9px] font-body text-[18px] text-ink-deep outline-none transition-colors duration-[400ms] focus:border-b-gold";
const labelCls =
  "font-body text-[9.5px] font-light uppercase tracking-label text-clay";
const detailLabelCls = labelCls;
const detailValueCls =
  "font-body text-[17.5px] leading-[1.6] text-[rgba(28,27,23,0.82)]";
const detailLinkCls =
  "border-b border-[rgba(184,149,106,0.5)] font-body text-[17.5px] text-ink-deep no-underline transition-colors hover:text-clay";

export default function Contact() {
  const t = useT();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [day, setDay] = useState("Fark etmez");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);

  // NOTE: no backend — visual/fake success only (backend is a separate track).
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErr(true);
      return;
    }
    setErr(false);
    setDone(true);
  };

  return (
    <section
      id="iletisim"
      aria-label="İletişim ve Randevu"
      className="bg-paper py-[42px] px-[clamp(22px,5vw,64px)] md:py-[clamp(68px,10vw,128px)]"
    >
      <div className="mx-auto max-w-[1060px]">
        <motion.div
          {...revealProps}
          id="randevu"
          className="max-w-[640px] scroll-mt-[90px]"
        >
          <div className="mb-4 h-px w-[30px] bg-gold" />
          <div className="font-body text-[10.5px] font-light uppercase tracking-label text-clay">
            {t("iletisim.eyebrow")}
          </div>
          <MaskReveal className="mt-[18px] font-display text-[clamp(30px,3.2vw,44px)] font-[380] leading-[1.08] tracking-tight [text-wrap:balance]">
            {t("iletisim.title")}
          </MaskReveal>
          <p className="mt-5 font-body text-[clamp(17px,1.4vw,19.5px)] leading-[1.7] text-[rgba(28,27,23,0.78)] [text-wrap:pretty]">
            {t("iletisim.intro")}
          </p>
        </motion.div>

        <div className="mt-[clamp(36px,5vw,60px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-[clamp(44px,6vw,96px)]">
          {/* Form / success */}
          <motion.div {...revealProps}>
            {done ? (
              <div className="animate-fade-up rounded-[6px] border border-[rgba(184,149,106,0.45)] bg-paper-cool px-[30px] py-9 text-center">
                <div className="font-body text-[10px] font-light uppercase tracking-label text-clay">
                  Randevu isteğin alındı
                </div>
                <p className="mt-[14px] font-body text-[clamp(22px,2vw,28px)] font-normal leading-[1.3]">
                  Aldık. 24 saat içinde döneceğiz.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-6 font-body text-[13.5px] leading-[1.7] text-[rgba(28,27,23,0.55)] [text-wrap:pretty]">
                  <MultiLine text={t("iletisim.form_hint")} />
                </p>
                <form onSubmit={onSubmit} className="flex flex-col gap-[26px]">
                  <label className="flex flex-col gap-2">
                    <span className={labelCls}>Ad *</span>
                    <input
                      type="text"
                      name="ad"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className={inputCls}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className={labelCls}>Telefon *</span>
                    <input
                      type="tel"
                      name="telefon"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      inputMode="tel"
                      className={inputCls}
                    />
                  </label>

                  <div className="flex flex-col gap-[10px]">
                    <span className={labelCls}>Tercih ettiğin gün</span>
                    <div className="flex flex-wrap gap-[10px]">
                      {DAYS.map((d) => {
                        const active = day === d;
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDay(d)}
                            className={`cursor-pointer rounded-full border px-[18px] pb-[11px] pt-3 font-body text-[9.5px] font-light uppercase tracking-label transition-all duration-[400ms] ease-smooth ${
                              active
                                ? "border-ink-deep bg-ink-deep text-paper"
                                : "border-[rgba(14,14,12,0.28)] bg-transparent text-ink-soft"
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className={labelCls}>
                      Eklemek istediğin bir şey{" "}
                      <span className="text-[rgba(138,111,79,0.55)]">
                        (opsiyonel)
                      </span>
                    </span>
                    <textarea
                      name="not"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className={`${inputCls} resize-y`}
                    />
                  </label>

                  {err && (
                    <p className="-mt-2 font-body text-[9.5px] font-light uppercase tracking-label text-clay">
                      Ad ve telefon gerekli.
                    </p>
                  )}

                  <div>
                    <button
                      type="submit"
                      className="inline-flex cursor-pointer items-center gap-[10px] rounded-full border-none bg-ink-deep px-7 pb-4 pt-[17px] font-body text-[10.5px] font-light uppercase tracking-label text-paper transition-colors duration-500 ease-smooth hover:bg-clay"
                    >
                      Randevumu bırak{" "}
                      <span className="font-accent text-[15px] tracking-normal">
                        →
                      </span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>

          {/* Contact details */}
          <motion.div
            {...revealProps}
            className="flex flex-col gap-[22px] border-t border-[rgba(14,14,12,0.12)] pt-[26px]"
          >
            <div className="flex flex-col gap-[6px]">
              <span className={detailLabelCls}>Adres</span>
              <span className={detailValueCls}>{t("iletisim.address")}</span>
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className={detailLabelCls}>Telefon / WhatsApp</span>
              <div className="flex flex-wrap gap-4">
                <a href={TEL} className={detailLinkCls}>
                  0 535 483 89 97
                </a>
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener"
                  className="border-b border-[rgba(184,149,106,0.5)] font-accent text-[17.5px] italic text-ink-deep no-underline transition-colors hover:text-clay"
                >
                  WhatsApp&apos;tan yaz
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className={detailLabelCls}>E-posta</span>
              <a href={MAIL} className={`${detailLinkCls} self-start`}>
                alperenaygin21@gmail.com
              </a>
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className={detailLabelCls}>Saatler</span>
              <span className={detailValueCls}>{t("iletisim.hours")}</span>
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className={detailLabelCls}>Instagram</span>
              <a
                href={IG}
                target="_blank"
                rel="noopener"
                className={`${detailLinkCls} self-start`}
              >
                @alperenayginhairstudio
              </a>
            </div>

            <div className="flex flex-col gap-[10px]">
              <span className={detailLabelCls}>Harita</span>
              <StyledMap />
            </div>

            <p className="mt-2 font-body text-[9px] font-light uppercase tracking-label text-[rgba(28,27,23,0.45)]">
              KVKK: [aydınlatma metni linki]
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
