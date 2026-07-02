import type { Metadata } from "next";
import { archivo, fraunces, instrumentSerif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sakarya Protez Saç — Alperen Aygın · Serdivan Saç Sistemi Uygulaması",
  description:
    "Serdivan / Sakarya'da saç sistemi ve protez saç uygulaması. Acısız, geri dönüşü olan, %100 gerçek insan saçı. Ayrı odalı özel atölye.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${instrumentSerif.variable} ${archivo.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
