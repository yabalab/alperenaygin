import type { MetadataRoute } from "next";

// PWA manifest. Focused on the admin panel (start_url=/yonetim) so installing it
// opens straight into the panel. It's valid for the whole origin, so an install
// prompt may also appear on the public site — that's fine.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alperen Aygın Yönetim",
    short_name: "AA Yönetim",
    description: "Alperen Aygın Hair Studio — randevu ve içerik yönetim paneli.",
    start_url: "/yonetim",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "tr",
    dir: "ltr",
    background_color: "#F4EFE6", // brand `paper` — splash background
    theme_color: "#0E0E0C", // brand `ink-deep` — app chrome
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
