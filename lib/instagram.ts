/**
 * Instagram feed — STATIC placeholder for now.
 * Backend track: replace INSTAGRAM_POSTS with data fetched from the Instagram
 * API (Basic Display / Graph). Keep the shape { src, href, alt } so the
 * carousel doesn't change. `href` should become each post's permalink.
 */
export const INSTAGRAM_URL = "https://instagram.com/alperenayginhairstudio";

export type InstagramPost = {
  src: string;
  href: string; // TODO(backend): per-post permalink; profile URL for now
  alt: string;
};

export const INSTAGRAM_POSTS: InstagramPost[] = [
  { src: "/images/ba1-sonra.png", href: INSTAGRAM_URL, alt: "Uygulama sonrası" },
  { src: "/images/salon-sacli.png", href: INSTAGRAM_URL, alt: "Saç sistemi sonrası salon çekimi" },
  { src: "/images/atolye-lobi.png", href: INSTAGRAM_URL, alt: "Atölye lobisi" },
  { src: "/images/ba1-once.png", href: INSTAGRAM_URL, alt: "Uygulama öncesi" },
  { src: "/images/alperen-portre.png", href: INSTAGRAM_URL, alt: "Alperen Aygın" },
  { src: "/images/atolye-oda.png", href: INSTAGRAM_URL, alt: "Özel uygulama odası" },
  { src: "/images/salon-kel.png", href: INSTAGRAM_URL, alt: "Uygulama öncesi salon çekimi" },
  { src: "/images/ba1-full.jpg", href: INSTAGRAM_URL, alt: "Öncesi ve sonrası" },
  { src: "/images/model-ferah-tarama.png", href: INSTAGRAM_URL, alt: "Ferah Tarama modeli" },
  { src: "/images/model-lux-protez.png", href: INSTAGRAM_URL, alt: "Lux Protez modeli" },
];
