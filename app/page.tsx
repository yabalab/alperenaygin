import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import WhatIsIt from "@/components/WhatIsIt";
import Proof from "@/components/Proof";
import InstagramMarquee from "@/components/InstagramMarquee";
import Models from "@/components/Models";
import Process from "@/components/Process";
import Studio from "@/components/Studio";
import Master from "@/components/Master";

export default function Home() {
  return (
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
      <InstagramMarquee />
      <Models />
      <Process />
      <Studio />
      <Master />
    </div>
  );
}
