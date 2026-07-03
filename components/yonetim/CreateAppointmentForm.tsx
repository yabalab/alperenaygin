"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import {
  createManualAppointment,
  type CreateApptState,
} from "@/app/yonetim/actions";
import type { CustomerLite } from "@/lib/crm/types";
import type { ScheduleData } from "@/lib/crm/queries";
import { ADMIN_SLOT_HOURS } from "@/lib/crm/slots";
import { formatFullDate } from "@/lib/crm/format";
import { sanitizeTrPhone, formatTrPhone } from "@/lib/phone";
import AdminCalendar from "./AdminCalendar";

const initial: CreateApptState = { error: null };

export default function CreateAppointmentForm({
  customers,
  schedule,
}: {
  customers: CustomerLite[];
  schedule: ScheduleData;
}) {
  const [state, formAction, pending] = useActionState(
    createManualAppointment,
    initial
  );

  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [closeSlot, setCloseSlot] = useState(false);
  const [closeAllDay, setCloseAllDay] = useState(false);
  const [durum, setDurum] = useState<"onaylandi" | "bekliyor">("onaylandi");
  const [note, setNote] = useState("");

  // Customer picker state
  const [selected, setSelected] = useState<CustomerLite | null>(null);
  const [search, setSearch] = useState("");
  const [newMode, setNewMode] = useState(false);
  const [newAd, setNewAd] = useState("");
  const [newPhone, setNewPhone] = useState(""); // raw digits

  const customerMode = selected ? "existing" : newMode ? "new" : "none";
  const wantsAppointment = customerMode !== "none";

  // Per-day marks for the selected date.
  const marks = useMemo(() => {
    const counts: Record<string, number> = {};
    const blockedSet = new Set<string>();
    let dayBlocked = false;
    if (date) {
      for (const a of schedule.appts) {
        if (a.tarih === date && a.durum !== "iptal" && a.durum !== "gelmedi") {
          counts[a.saat] = (counts[a.saat] ?? 0) + 1;
        }
      }
      for (const b of schedule.blocked) {
        if (b.tarih === date) {
          if (b.saat === null) dayBlocked = true;
          else blockedSet.add(b.saat);
        }
      }
    }
    return { counts, blockedSet, dayBlocked };
  }, [date, schedule]);

  const filteredCustomers = useMemo(() => {
    const qName = search.trim().toLocaleLowerCase("tr");
    const qDigits = search.replace(/\D/g, "");
    if (!qName && !qDigits) return customers;
    return customers.filter((c) => {
      const nameHit = c.ad.toLocaleLowerCase("tr").includes(qName);
      const phoneHit =
        qDigits.length > 0 && c.telefon.replace(/\D/g, "").includes(qDigits);
      return (qName && nameHit) || phoneHit;
    });
  }, [customers, search]);

  // Submit gating — mirror the server validation for instant feedback.
  const needsSlot = (wantsAppointment || closeSlot) && !closeAllDay;
  const canSubmit =
    !!date &&
    (wantsAppointment || closeSlot || closeAllDay) &&
    (!needsSlot || !!slot) &&
    (customerMode !== "new" ||
      (newAd.trim().length > 0 && sanitizeTrPhone(newPhone).length === 11));

  const submitLabel = wantsAppointment
    ? "Randevu Oluştur"
    : closeAllDay
      ? "Günü Kapat"
      : "Saati Kapat";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* hidden serialized state */}
      <input type="hidden" name="tarih" value={date ?? ""} />
      <input type="hidden" name="saat" value={closeAllDay ? "" : (slot ?? "")} />
      <input type="hidden" name="durum" value={durum} />
      <input type="hidden" name="note" value={note} />
      <input type="hidden" name="closeSlot" value={String(closeSlot)} />
      <input type="hidden" name="closeAllDay" value={String(closeAllDay)} />
      <input type="hidden" name="customerMode" value={customerMode} />
      <input type="hidden" name="customerId" value={selected?.id ?? ""} />
      <input type="hidden" name="newAd" value={newAd} />
      <input type="hidden" name="newPhone" value={newPhone} />

      {/* 1) DATE */}
      <Card step="1" title="Tarih seç">
        <AdminCalendar
          value={date}
          onSelect={(iso) => {
            setDate(iso);
            setSlot(null);
          }}
        />
        {date && (
          <p className="mt-3 font-body text-[13px] text-ink-soft">
            Seçilen: <span className="text-ink-deep">{formatFullDate(date)}</span>
            {marks.dayBlocked && (
              <span className="ml-2 rounded bg-rose-100 px-2 py-0.5 text-[11px] text-rose-700">
                Bu gün zaten kapalı
              </span>
            )}
          </p>
        )}
      </Card>

      {/* 2) SLOT */}
      <Card step="2" title="Saat seç">
        {!date ? (
          <p className="font-body text-[13px] text-ink-soft/50">
            Önce tarih seçin.
          </p>
        ) : closeAllDay ? (
          <p className="font-body text-[13px] text-ink-soft/60">
            Tüm gün kapatılacak — saat seçmeye gerek yok.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {ADMIN_SLOT_HOURS.map((h) => {
              const count = marks.counts[h] ?? 0;
              const blocked = marks.blockedSet.has(h);
              const active = slot === h;
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => setSlot(active ? null : h)}
                  className={`relative flex flex-col items-center rounded-lg border py-2.5 font-body text-[14px] transition-colors ${
                    active
                      ? "border-gold bg-gold/15 text-ink-deep"
                      : "border-ink-deep/15 bg-white text-ink-soft hover:border-ink-deep/40"
                  }`}
                >
                  <span className="font-medium">{h}</span>
                  {(count > 0 || blocked) && (
                    <span className="mt-0.5 text-[10px] leading-none">
                      {blocked && <span className="text-rose-600">kapalı </span>}
                      {count > 0 && (
                        <span className="text-amber-700">{count} rndv</span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
        {date && !closeAllDay && slot && (marks.counts[slot] ?? 0) > 0 && (
          <p className="mt-3 font-body text-[12px] text-amber-700">
            Bu saatte zaten {marks.counts[slot]} randevu var — yine de
            ekleyebilirsiniz.
          </p>
        )}
      </Card>

      {/* 3) BLOCKING */}
      <Card step="3" title="Slot kapatma (opsiyonel)">
        <label className="flex items-center gap-3 py-1">
          <input
            type="checkbox"
            checked={closeSlot}
            disabled={closeAllDay || !slot}
            onChange={(e) => setCloseSlot(e.target.checked)}
            className="h-5 w-5 accent-ink-deep disabled:opacity-40"
          />
          <span
            className={`font-body text-[14px] ${
              closeAllDay || !slot ? "text-ink-soft/40" : "text-ink-deep"
            }`}
          >
            Bu saati randevuya kapat
            {!slot && !closeAllDay && (
              <span className="text-ink-soft/40"> (önce saat seçin)</span>
            )}
          </span>
        </label>
        <label className="flex items-center gap-3 py-1">
          <input
            type="checkbox"
            checked={closeAllDay}
            onChange={(e) => {
              setCloseAllDay(e.target.checked);
              if (e.target.checked) setCloseSlot(false);
            }}
            className="h-5 w-5 accent-ink-deep"
          />
          <span className="font-body text-[14px] text-ink-deep">
            Tüm günü kapat{" "}
            <span className="text-ink-soft/50">(bayram vb.)</span>
          </span>
        </label>
      </Card>

      {/* 4) CUSTOMER */}
      <Card step="4" title="Müşteri">
        <p className="-mt-1 mb-3 font-body text-[12px] text-ink-soft/50">
          Sadece kapatma yapıyorsanız müşteri seçmenize gerek yok.
        </p>

        {selected ? (
          <div className="flex items-center justify-between rounded-lg border border-gold/40 bg-gold/10 px-4 py-3">
            <div>
              <div className="font-display text-[16px] text-ink-deep">
                {selected.ad}
              </div>
              <div className="font-body text-[13px] text-ink-soft/70">
                {formatTrPhone(selected.telefon)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="font-body text-[12px] text-ink-soft underline hover:text-ink-deep"
            >
              değiştir
            </button>
          </div>
        ) : newMode ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Ad Soyad"
              value={newAd}
              onChange={(e) => setNewAd(e.target.value)}
              className="w-full rounded-lg border border-ink-deep/15 bg-white px-4 py-3 font-body text-[15px] outline-none focus:border-gold"
            />
            <input
              type="tel"
              inputMode="numeric"
              placeholder="05XX XXX XX XX"
              value={formatTrPhone(newPhone)}
              onChange={(e) => setNewPhone(sanitizeTrPhone(e.target.value))}
              className="w-full rounded-lg border border-ink-deep/15 bg-white px-4 py-3 font-body text-[15px] tabular-nums outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={() => {
                setNewMode(false);
                setNewAd("");
                setNewPhone("");
              }}
              className="self-start font-body text-[12px] text-ink-soft underline hover:text-ink-deep"
            >
              vazgeç
            </button>
          </div>
        ) : (
          <div>
            <input
              type="search"
              placeholder="İsim veya telefon ara…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-ink-deep/15 bg-white px-4 py-3 font-body text-[15px] outline-none focus:border-gold"
            />
            <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-ink-deep/10">
              {filteredCustomers.length === 0 ? (
                <p className="px-4 py-4 font-body text-[13px] text-ink-soft/50">
                  Müşteri bulunamadı.
                </p>
              ) : (
                filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelected(c)}
                    className="flex w-full items-center justify-between border-b border-ink-deep/5 px-4 py-3 text-left transition-colors last:border-0 hover:bg-black/[0.03]"
                  >
                    <span className="font-body text-[15px] text-ink-deep">
                      {c.ad}
                    </span>
                    <span className="font-body text-[13px] text-ink-soft/60 tabular-nums">
                      {formatTrPhone(c.telefon)}
                    </span>
                  </button>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setNewMode(true);
                setSearch("");
              }}
              className="mt-3 w-full rounded-lg border border-dashed border-ink-deep/25 py-3 font-body text-[14px] text-ink-soft transition-colors hover:border-ink-deep hover:text-ink-deep"
            >
              + Yeni müşteri ekle
            </button>
          </div>
        )}
      </Card>

      {/* 5) STATUS + NOTE (only meaningful with an appointment) */}
      {wantsAppointment && (
        <Card step="5" title="Durum ve not">
          <div className="flex gap-2">
            {(["onaylandi", "bekliyor"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDurum(d)}
                className={`rounded-lg border px-4 py-2.5 font-body text-[14px] transition-colors ${
                  durum === d
                    ? "border-ink-deep bg-ink-deep text-paper"
                    : "border-ink-deep/15 text-ink-soft hover:bg-black/5"
                }`}
              >
                {d === "onaylandi" ? "Onaylandı" : "Onay bekliyor"}
              </button>
            ))}
          </div>
          <textarea
            rows={2}
            placeholder="Not (opsiyonel)…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-3 w-full resize-y rounded-lg border border-ink-deep/15 bg-white px-3 py-2.5 font-body text-[14px] outline-none focus:border-gold"
          />
        </Card>
      )}

      {/* reason note when only closing */}
      {!wantsAppointment && (closeSlot || closeAllDay) && (
        <Card step="5" title="Kapatma sebebi (opsiyonel)">
          <textarea
            rows={2}
            placeholder="Örn. Kurban Bayramı"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full resize-y rounded-lg border border-ink-deep/15 bg-white px-3 py-2.5 font-body text-[14px] outline-none focus:border-gold"
          />
        </Card>
      )}

      {state.error && (
        <p className="font-body text-[13px] text-rose-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || pending}
        className="sticky bottom-4 rounded-lg bg-ink-deep px-6 py-4 font-body text-[13px] uppercase tracking-label text-paper shadow-lg transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {pending ? "Kaydediliyor…" : submitLabel}
      </button>
    </form>
  );
}

function Card({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-ink-deep/10 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-deep/5 font-body text-[11px] text-ink-soft">
          {step}
        </span>
        <h2 className="font-body text-[11px] uppercase tracking-label text-clay">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
