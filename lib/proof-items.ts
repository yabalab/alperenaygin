/**
 * KANIT (before/after) carousel item shape + static fallback.
 *
 * The carousel now renders live cards from the `before_after` table (mapped in
 * app/page.tsx). This shape is unchanged so ProofCard/Proof stay identical.
 * PROOF_FALLBACK is shown ONLY when there are no active cards yet, so the
 * section (heading + Instagram link) never looks empty.
 */
export type ProofItem = {
  before: string; // storage base path (remote) OR local /images path (fallback)
  after: string;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
  remote?: boolean; // true => serve before/after through mediaLoader
};

/** Caption from a card's optional fields: "[isim, yas — sure]" (parts omitted). */
export function buildCaption(
  isim: string | null | undefined,
  yas: string | null | undefined,
  sure: string | null | undefined
): string {
  const name = (isim ?? "").trim();
  const age = (yas ?? "").trim();
  const dur = (sure ?? "").trim();
  if (!name && !age && !dur) return "";
  let head = name;
  if (age) head = head ? `${head}, ${age}` : age;
  const body = dur ? (head ? `${head} — ${dur}` : dur) : head;
  return `[${body}]`;
}

export const PROOF_FALLBACK: ProofItem[] = [
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
