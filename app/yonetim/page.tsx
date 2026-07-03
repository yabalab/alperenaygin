import Link from "next/link";
import { getAppointments } from "@/lib/crm/queries";
import AppointmentsBoard from "@/components/yonetim/AppointmentsBoard";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

export default async function YonetimPage() {
  const appointments = await getAppointments();

  return (
    <main className="min-h-svh bg-paper text-ink-deep">
      <header className="sticky top-0 z-10 border-b border-ink-deep/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="font-body text-[10px] uppercase tracking-label text-clay">
              Alperen Aygın
            </p>
            <h1 className="mt-0.5 font-display text-lg font-light tracking-tight">
              Randevular
            </h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="border border-ink-deep/20 px-3 py-2 font-body text-[11px] uppercase tracking-label text-ink-soft transition-colors hover:border-ink-deep hover:text-ink-deep"
            >
              Çıkış
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Link
          href="/yonetim/randevu/yeni"
          className="mb-5 flex items-center justify-center gap-2 rounded-lg bg-ink-deep px-4 py-3.5 font-body text-[13px] uppercase tracking-label text-paper transition-opacity hover:opacity-90"
        >
          + Randevu Oluştur
        </Link>
        <AppointmentsBoard appointments={appointments} />
      </div>
    </main>
  );
}
