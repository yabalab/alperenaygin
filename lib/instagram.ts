/**
 * Instagram feed item shape + static fallback.
 *
 * The band now renders live posts from the `instagram_posts` table (mapped in
 * app/page.tsx). This shape is unchanged so Instagram.tsx stays identical.
 * INSTAGRAM_FALLBACK is shown ONLY when there are no active posts, so the band
 * never looks empty.
 *
 * A later "integration phase" will additionally pull posts from the Instagram
 * Graph API; the admin already has a passive placeholder for that.
 */
export const INSTAGRAM_URL = "https://instagram.com/alperenayginhairstudio";

export type InstagramPost = {
  src: string; // storage base path (remote) OR local /images path (fallback)
  href: string; // per-post permalink; profile URL as fallback
  alt: string;
  remote?: boolean; // true => serve src through mediaLoader
};

export const INSTAGRAM_FALLBACK: InstagramPost[] = [
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
