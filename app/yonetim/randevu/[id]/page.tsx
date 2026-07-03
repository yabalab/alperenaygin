import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppointmentDetail } from "@/lib/crm/queries";
import {
  STATUS_TRANSITIONS,
  ACTION_TONE_CLASS,
  SOURCE_LABEL,
} from "@/lib/crm/status";
import { formatFullDate, formatTimestamp, dayLabel } from "@/lib/crm/format";
import { StatusBadge, PhoneActions, PhoneText } from "@/components/yonetim/ui";
import { setAppointmentStatus, addAppointmentNote } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getAppointmentDetail(id);
  if (!detail) notFound();

  const { appointment: a, notes, others, sameSlot } = detail;
  const actions = STATUS_TRANSITIONS[a.durum];

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

      <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-6 sm:px-6">
        {/* Customer + appointment card */}
        <section className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {a.customer ? (
                <Link
                  href={`/yonetim/musteriler/${a.customer.id}`}
                  className="group inline-flex items-baseline gap-1.5"
                >
                  <h1 className="font-display text-2xl font-light tracking-tight group-hover:underline">
                    {a.customer.ad}
                  </h1>
                  <span className="font-body text-[13px] text-clay">→</span>
                </Link>
              ) : (
                <h1 className="font-display text-2xl font-light tracking-tight">
                  — (müşteri silinmiş)
                </h1>
              )}
              {a.customer && (
                <p className="mt-1 font-body text-[14px] text-ink-soft/70">
                  <PhoneText phone={a.customer.telefon} />
                </p>
              )}
            </div>
            <StatusBadge durum={a.durum} />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-ink-deep/5 pt-4">
            <Field label="Tarih">
              {formatFullDate(a.tarih)}{" "}
              <span className="text-ink-soft/50">({dayLabel(a.tarih)})</span>
            </Field>
            <Field label="Saat">{a.saat}</Field>
            <Field label="Kaynak">{SOURCE_LABEL[a.kaynak]}</Field>
            <Field label="Oluşturma">{formatTimestamp(a.created_at)}</Field>
          </dl>

          {a.not_metni && (
            <div className="mt-4 rounded-lg bg-paper-warm/60 px-4 py-3">
              <p className="font-body text-[11px] uppercase tracking-label text-clay">
                Randevu notu
              </p>
              <p className="mt-1 font-body text-[14px] text-ink-soft">
                {a.not_metni}
              </p>
            </div>
          )}

          {a.customer && (
            <div className="mt-5">
              <PhoneActions phone={a.customer.telefon} />
            </div>
          )}
        </section>

        {/* Status actions */}
        <section className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
          <h2 className="font-body text-[11px] uppercase tracking-label text-clay">
            Durum
          </h2>
          {actions.length === 0 ? (
            <p className="mt-3 font-body text-[13px] text-ink-soft/60">
              Bu randevu kapandı, başka işlem yok.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2.5">
              {actions.map((act) => (
                <form key={act.to} action={setAppointmentStatus}>
                  <input type="hidden" name="id" value={a.id} />
                  <input type="hidden" name="durum" value={act.to} />
                  <button
                    type="submit"
                    className={`rounded-lg border px-5 py-3 font-body text-[14px] font-medium transition-colors ${ACTION_TONE_CLASS[act.tone]}`}
                  >
                    {act.label}
                  </button>
                </form>
              ))}
            </div>
          )}
        </section>

        {/* Notes */}
        <section className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
          <h2 className="font-body text-[11px] uppercase tracking-label text-clay">
            Notlar
          </h2>

          <form action={addAppointmentNote} className="mt-3 flex flex-col gap-2">
            <input type="hidden" name="appointmentId" value={a.id} />
            {a.customer && (
              <input type="hidden" name="customerId" value={a.customer.id} />
            )}
            <textarea
              name="icerik"
              rows={2}
              required
              placeholder="Not ekle…"
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

        {/* Same slot — other appointments at this exact tarih + saat */}
        {sameSlot.length > 0 && (
          <section className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
            <h2 className="font-body text-[11px] uppercase tracking-label text-clay">
              Bu saatte diğer randevular
            </h2>
            <p className="mt-1 font-body text-[12px] text-ink-soft/50">
              {formatFullDate(a.tarih)} · {a.saat}
            </p>
            <ul className="mt-3 flex flex-col divide-y divide-ink-deep/5">
              {sameSlot.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/yonetim/randevu/${o.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 transition-colors hover:opacity-70"
                  >
                    <span className="min-w-0 truncate font-body text-[14px] text-ink-deep">
                      {o.customer?.ad ?? "— (müşteri silinmiş)"}
                      {o.kaynak === "manuel" && (
                        <span className="ml-2 text-[12px] text-ink-soft/50">
                          Manuel
                        </span>
                      )}
                    </span>
                    <StatusBadge durum={o.durum} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Customer history */}
        {others.length > 0 && (
          <section className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
            <h2 className="font-body text-[11px] uppercase tracking-label text-clay">
              Müşterinin diğer randevuları
            </h2>
            <ul className="mt-3 flex flex-col divide-y divide-ink-deep/5">
              {others.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/yonetim/randevu/${o.id}`}
                    className="flex items-center justify-between gap-3 py-2.5 transition-colors hover:opacity-70"
                  >
                    <span className="font-body text-[14px] text-ink-soft">
                      {dayLabel(o.tarih)} · {o.saat}
                    </span>
                    <StatusBadge durum={o.durum} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-body text-[11px] uppercase tracking-label text-ink-soft/50">
        {label}
      </dt>
      <dd className="mt-1 font-body text-[14px] text-ink-deep">{children}</dd>
    </div>
  );
}
