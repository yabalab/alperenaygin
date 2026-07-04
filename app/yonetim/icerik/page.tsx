import Link from "next/link";
import { getSiteContent } from "@/lib/cms/queries";
import { getSiteMedia } from "@/lib/cms/media-queries";
import { getAllBeforeAfter } from "@/lib/cms/before-after";
import { getAllInstagram } from "@/lib/cms/instagram";
import ContentEditor from "@/components/yonetim/ContentEditor";
import { logout } from "../actions";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  // Current effective values (saved DB values over hardcoded defaults).
  const [values, media, beforeAfter, instagram] = await Promise.all([
    getSiteContent(),
    getSiteMedia(),
    getAllBeforeAfter(),
    getAllInstagram(),
  ]);

  return (
    <main className="min-h-svh bg-paper text-ink-deep">
      <header className="sticky top-0 z-10 border-b border-ink-deep/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="font-body text-[10px] uppercase tracking-label text-clay">
              Alperen Aygın
            </p>
            <h1 className="mt-0.5 font-display text-lg font-light tracking-tight">
              İçerik
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/yonetim"
              className="font-body text-[12px] text-ink-soft transition-colors hover:text-ink-deep"
            >
              Randevular
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="border border-ink-deep/20 px-3 py-2 font-body text-[11px] uppercase tracking-label text-ink-soft transition-colors hover:border-ink-deep hover:text-ink-deep"
              >
                Çıkış
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <p className="mb-5 font-body text-[13px] text-ink-soft/60">
          Bir bölüm seçin, metinleri düzenleyip kaydedin. Boş bırakılan alan
          sitede varsayılan metne döner.
        </p>
        <ContentEditor
          values={values}
          media={media}
          beforeAfter={beforeAfter}
          instagram={instagram}
        />
      </div>
    </main>
  );
}
