/**
 * KANIT (before/after) carousel data.
 * FAKE for now — reuses the two existing before/after pairs. Real images will
 * be multiplied in later; keep this shape (before/after/caption) so the
 * carousel doesn't change.
 */
export type ProofItem = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
};

export const PROOF_ITEMS: ProofItem[] = [
  {
    before: "/images/ba1-once.png",
    after: "/images/ba1-sonra.png",
    beforeAlt: "Uygulama öncesi",
    afterAlt: "Uygulama sonrası — saç sistemi uygulanmış",
    caption: "[Mehmet, 34 — bir öğle arasında]",
  },
  {
    before: "/images/salon-kel.png",
    after: "/images/salon-sacli.png",
    beforeAlt: "Uygulama öncesi — salon çekimi",
    afterAlt: "Uygulama sonrası — salon çekimi",
    caption: "[Bir öğleden sonra]",
  },
  {
    before: "/images/ba1-once.png",
    after: "/images/ba1-sonra.png",
    beforeAlt: "Uygulama öncesi",
    afterAlt: "Uygulama sonrası — saç sistemi uygulanmış",
    caption: "[İki saatlik bir mola]",
  },
  {
    before: "/images/salon-kel.png",
    after: "/images/salon-sacli.png",
    beforeAlt: "Uygulama öncesi — salon çekimi",
    afterAlt: "Uygulama sonrası — salon çekimi",
    caption: "[Serdivan'da bir gün]",
  },
];
