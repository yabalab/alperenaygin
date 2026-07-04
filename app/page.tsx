import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import WhatIsIt from "@/components/WhatIsIt";
import Proof from "@/components/Proof";
import Instagram from "@/components/Instagram";
import Models from "@/components/Models";
import Process from "@/components/Process";
import Studio from "@/components/Studio";
import Master from "@/components/Master";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RandevuChip from "@/components/RandevuChip";
import { getSiteContent } from "@/lib/cms/queries";
import { getSiteMedia } from "@/lib/cms/media-queries";
import { ContentProvider } from "@/components/cms/ContentProvider";

// ISR: serve cached HTML, refresh content at most hourly. CMS saves call
// revalidatePath("/") to push edits live immediately.
export const revalidate = 3600;

export default async function Home() {
  const [content, media] = await Promise.all([
    getSiteContent(),
    getSiteMedia(),
  ]);

  return (
    <ContentProvider content={content}>
    <div className="min-h-svh bg-paper font-body text-ink-deep">
      <h1 className="absolute h-px w-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]">
        Sakarya Protez Saç — Alperen Aygın · Serdivan Saç Sistemi Uygulaması
      </h1>

      <Header />

      {/* offset for the fixed 64px header */}
      <div id="top" className="h-16" />

      <Hero />
      <TrustStrip />
      <WhatIsIt />
      <Proof />
      <Instagram />
      <Models />
      <Process />
      <Studio />
      <Master portrait={media.usta ?? null} />
      <Faq />
      <Contact />
      <Footer />
      <RandevuChip />
    </div>
    </ContentProvider>
  );
}
