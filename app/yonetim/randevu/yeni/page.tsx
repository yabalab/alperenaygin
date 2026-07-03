import Link from "next/link";
import { getCustomers, getScheduleData } from "@/lib/crm/queries";
import CreateAppointmentForm from "@/components/yonetim/CreateAppointmentForm";

export const dynamic = "force-dynamic";

export default async function NewAppointmentPage() {
  const [customers, schedule] = await Promise.all([
    getCustomers(),
    getScheduleData(),
  ]);

  return (
    <main className="min-h-svh bg-paper text-ink-deep">
      <header className="sticky top-0 z-10 border-b border-ink-deep/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/yonetim"
            className="font-body text-[13px] text-ink-soft transition-colors hover:text-ink-deep"
          >
            ← Randevular
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-light tracking-tight">
          Randevu Oluştur
        </h1>
        <CreateAppointmentForm customers={customers} schedule={schedule} />
      </div>
    </main>
  );
}
