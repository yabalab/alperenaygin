import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerProfile } from "@/lib/crm/queries";
import { SOURCE_LABEL } from "@/lib/crm/status";
import { formatFullDate, formatTimestamp, dayLabel } from "@/lib/crm/format";
import { StatusBadge, PhoneActions, PhoneText } from "@/components/yonetim/ui";
import EditCustomerForm from "@/components/yonetim/EditCustomerForm";
import { addCustomerNote } from "../../actions";

export const dynamic = "force-dynamic";

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getCustomerProfile(id);
  if (!profile) notFound();

  const { customer: c, appointments, notes, stats } = profile;

  return (
    <main className="min-h-svh bg-paper text-ink-deep">
      <header className="sticky top-0 z-10 border-b border-ink-deep/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/yonetim/musteriler"
            className="font-body text-[13px] text-ink-soft transition-colors hover:text-ink-deep"
          >
            ← Müşteriler
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-6 sm:px-6">
        {/* Identity */}
        <section className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-light tracking-tight">
                {c.ad}
              </h1>
              <p className="mt-1 font-body text-[14px] text-ink-soft/70">
                <PhoneText phone={c.telefon} />
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 font-body text-[11px] ${
                c.kampanya_izni
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-ink-deep/15 bg-paper text-ink-soft/60"
              }`}
            >
              Kampanya: {c.kampanya_izni ? "izin var" : "izin yok"}
            </span>
          </div>

          <div className="mt-4">
            <PhoneActions phone={c.telefon} />
          </div>

          <div className="mt-4 border-t border-ink-deep/5 pt-4">
            <EditCustomerForm id={c.id} ad={c.ad} telefon={c.telefon} />
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-body text-[11px] uppercase tracking-label text-clay">
            Özet
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat label="Geldi" value={String(stats.completed)} />
            <Stat label="Toplam randevu" value={String(stats.total)} />
            {stats.noShow > 0 && (
              <Stat label="Gelmedi" value={String(stats.noShow)} danger />
            )}
            <Stat
              label="İlk ziyaret"
              value={stats.firstVisit ? formatFullDate(stats.firstVisit) : "—"}
            />
            <Stat
              label="Son ziyaret"
              value={stats.lastVisit ? formatFullDate(stats.lastVisit) : "—"}
            />
          </div>
        </section>

        {/* Appointment history */}
        <section className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-body text-[11px] uppercase tracking-label text-clay">
            Randevu geçmişi
          </h2>
          {appointments.length === 0 ? (
            <p className="font-body text-[13px] text-ink-soft/50">
              Randevu yok.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-ink-deep/5">
              {appointments.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/yonetim/randevu/${a.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 transition-colors hover:opacity-70"
                  >
                    <span className="font-body text-[14px] text-ink-deep">
                      {dayLabel(a.tarih)} · {a.saat}
                      <span className="ml-2 text-[12px] text-ink-soft/50">
                        {SOURCE_LABEL[a.kaynak]}
                      </span>
                    </span>
                    <StatusBadge durum={a.durum} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Notes */}
        <section className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
          <h2 className="font-body text-[11px] uppercase tracking-label text-clay">
            Notlar
          </h2>

          <form action={addCustomerNote} className="mt-3 flex flex-col gap-2">
            <input type="hidden" name="customerId" value={c.id} />
            <textarea
              name="icerik"
              rows={2}
              required
              placeholder="Müşteri notu ekle…"
              className="w-full resize-y rounded-lg border border-ink-deep/15 bg-paper/40 px-3 py-2.5 font-body text-[14px] outline-none transition-colors focus:border-gold"
            />
            <button
              type="submit"
              className="self-end rounded-lg bg-ink-deep px-4 py-2.5 font-body text-[12px] uppercase tracking-label text-paper transition-opacity hover:opacity-90"
            >
              Not ekle
            </button>
          </form>

          <ul className="mt-4 flex flex-col gap-3">
            {notes.length === 0 ? (
              <li className="font-body text-[13px] text-ink-soft/50">
                Henüz not yok.
              </li>
            ) : (
              notes.map((n) => (
                <li
                  key={n.id}
                  className="border-l-2 border-gold/40 pl-3 font-body"
                >
                  <p className="text-[14px] text-ink-soft">{n.icerik}</p>
                  <p className="mt-0.5 text-[11px] text-ink-soft/50">
                    {formatTimestamp(n.created_at)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div>
      <div className="font-body text-[11px] uppercase tracking-label text-ink-soft/50">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-[18px] ${
          danger ? "text-rose-700" : "text-ink-deep"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
