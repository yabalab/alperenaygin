import type { Metadata } from "next";

// Belt-and-suspenders with robots.ts: keep the whole panel out of search
// results even if a URL leaks somewhere.
export const metadata: Metadata = {
  title: "Yönetim — Alperen Aygın",
  robots: { index: false, follow: false },
};

export default function YonetimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
