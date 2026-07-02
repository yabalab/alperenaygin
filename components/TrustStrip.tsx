// Güven şeridi — thin mono-labelled band directly under the hero.
// Reference (dist/index.html) renders this statically, without a reveal.

const ITEMS = [
  "[X] yıl",
  "Ayrı odalı özel atölye",
  "%100 gerçek insan saçı",
  "Serdivan / Sakarya",
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Güven şeridi"
      className="border-y border-[rgba(14,14,12,0.07)] bg-paper-warm py-5"
      style={{ paddingInline: "clamp(20px,4vw,46px)" }}
    >
      <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-center gap-x-[14px] gap-y-[10px]">
        {ITEMS.map((item, i) => (
          <span key={item} className="contents">
            <span className="whitespace-nowrap font-body text-[10px] font-light uppercase tracking-label text-ink-soft">
              {item}
            </span>
            {i < ITEMS.length - 1 && (
              <span aria-hidden className="text-[13px] leading-none text-gold">
                ·
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
