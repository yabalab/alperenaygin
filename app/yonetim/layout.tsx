import type { Metadata, Viewport } from "next";
import RegisterSW from "@/components/pwa/RegisterSW";

// PWA + panel chrome are scoped here so the public marketing site is untouched.
export const viewport: Viewport = {
  themeColor: "#0E0E0C", // brand `ink-deep` — status/title bar in standalone
};

// Belt-and-suspenders with robots.ts: keep the whole panel out of search
// results even if a URL leaks somewhere.
export const metadata: Metadata = {
  title: "Yönetim — Alperen Aygın",
  robots: { index: false, follow: false },
  // iOS "add to home screen": standalone launch + home-screen icon + name.
  appleWebApp: {
    capable: true,
    title: "AA Yönetim",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function YonetimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RegisterSW />
      {children}
    </>
  );
}
