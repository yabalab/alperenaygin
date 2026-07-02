import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink-deep pb-10 pt-[clamp(56px,8vw,96px)] px-[clamp(22px,5vw,64px)]">
      <div className="mx-auto flex max-w-[1060px] flex-col items-center gap-[26px] text-center">
        <Image
          src="/images/logo-aa.png"
          alt="Alperen Aygın Hair Studio"
          width={1179}
          height={1091}
          className="block invert mix-blend-screen"
          style={{ height: 74, width: "auto" }}
        />
        <p className="m-0 font-accent text-[clamp(18px,1.8vw,22px)] italic text-[rgba(244,239,230,0.85)] [text-wrap:balance]">
          Serdivan&apos;da bir atölye. Bir aynaya geri dönüş.
        </p>
        <div className="h-px w-[30px] bg-[rgba(184,149,106,0.6)]" />
        <p className="m-0 max-w-[640px] font-body text-[9px] font-light uppercase leading-[2.2] tracking-label text-[rgba(244,239,230,0.38)]">
          Sakarya protez saç · Serdivan protez saç · protez saç uygulama · protez
          saç bakımı · saç sistemi Sakarya · Alperen Aygın
        </p>
        <p className="m-0 font-body text-[9.5px] font-light uppercase tracking-label text-[rgba(244,239,230,0.5)]">
          © [2026] Alperen Aygın. Sessizce hazırlandı.
        </p>
      </div>
    </footer>
  );
}
