"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { setAppointmentStatus } from "@/app/yonetim/actions";
import { STATUS_META, SOURCE_LABEL } from "@/lib/crm/status";
import type { AppointmentRow, AppointmentStatus } from "@/lib/crm/types";
import { dayLabel } from "@/lib/crm/format";
import { PhoneActions, PhoneText, StatusBadge } from "./ui";

type Tab = "aktif" | "gecmis";
const PAST_STATUSES: AppointmentStatus[] = ["tamamlandi", "iptal", "gelmedi"];

function trLower(s: string) {
  return s.toLocaleLowerCase("tr");
}

export default function AppointmentsBoard({
  appointments,
}: {
  appointments: AppointmentRow[];
}) {
  const pendingCount = appointments.filter((a) => a.durum === "bekliyor").length;
  const [tab, setTab] = useState<Tab>("aktif");
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [pastStatus, setPastStatus] = useState<AppointmentStatus | "all">("all");

  const matches = useMemo(() => {
    const qDigits = query.replace(/\D/g, "");
    const qName = trLower(query.trim());
    return (a: AppointmentRow) => {
      if (dateFilter && a.tarih !== dateFilter) return false;
      if (!query.trim()) return true;
      const nameHit = a.customer ? trLower(a.customer.ad).includes(qName) : false;
      const phoneHit =
        qDigits.length > 0 && a.customer
          ? a.customer.telefon.replace(/\D/g, "").includes(qDigits)
          : false;
      return nameHit || phoneHit;
    };
  }, [query, dateFilter]);

  const pending = appointments.filter((a) => a.durum === "bekliyor" && matches(a));
  const upcoming = appointments.filter(
    (a) => a.durum === "onaylandi" && matches(a)
  );
  const past = appointments.filter(
    (a) =>
      PAST_STATUSES.includes(a.durum) &&
      (pastStatus === "all" || a.durum === pastStatus) &&
      matches(a)
  );

  const totalPast = appointments.filter((a) =>
    PAST_STATUSES.includes(a.durum)
  ).length;

  return (
    <div>
      {/* Search + date filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          inputMode="text"
          placeholder="İsim veya telefon ara…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-ink-deep/15 bg-white px-4 py-3 font-body text-[15px] outline-none transition-colors focus:border-gold"
        />
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-lg border border-ink-deep/15 bg-white px-4 py-3 font-body text-[15px] outline-none transition-colors focus:border-gold sm:w-auto"
          />
          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter("")}
              className="shrink-0 rounded-lg border border-ink-deep/15 px-3 py-3 font-body text-[13px] text-ink-soft hover:bg-black/5"
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-2 border-b border-ink-deep/10">
        <TabButton active={tab === "aktif"} onClick={() => setTab("aktif")}>
          Aktif
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[11px] font-semibold text-white">
              {pendingCount}
            </span>
          )}
        </TabButton>
        <TabButton active={tab === "gecmis"} onClick={() => setTab("gecmis")}>
          Geçmiş
          <span className="ml-2 font-body text-[12px] text-ink-soft/50">
            {totalPast}
          </span>
        </TabButton>
      </div>

      {tab === "aktif" ? (
        <div className="mt-6 flex flex-col gap-8">
          <Section
            title="Onay bekleyen"
            count={pending.length}
            accent
            empty="Onay bekleyen randevu yok."
          >
            {pending.map((a) => (
              <AppointmentCard key={a.id} a={a} prominent />
            ))}
          </Section>
          <Section
            title="Yaklaşan"
            count={upcoming.length}
            empty="Yaklaşan (onaylı) randevu yok."
          >
            {upcoming.map((a) => (
              <AppointmentCard key={a.id} a={a} />
            ))}
          </Section>
        </div>
      ) : (
        <div className="mt-6">
          {/* status filter chips */}
          <div className="mb-5 flex flex-wrap gap-2">
            <Chip
              active={pastStatus === "all"}
              onClick={() => setPastStatus("all")}
            >
              Tümü
            </Chip>
            {PAST_STATUSES.map((s) => (
              <Chip
                key={s}
                active={pastStatus === s}
                onClick={() => setPastStatus(s)}
              >
                {STATUS_META[s].label}
              </Chip>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {past.length === 0 ? (
              <EmptyState text="Kayıt yok." />
            ) : (
              past.map((a) => <AppointmentCard key={a.id} a={a} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px flex items-center border-b-2 px-4 py-3 font-body text-[14px] transition-colors ${
        active
          ? "border-ink-deep text-ink-deep"
          : "border-transparent text-ink-soft/60 hover:text-ink-deep"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 font-body text-[12px] transition-colors ${
        active
          ? "border-ink-deep bg-ink-deep text-paper"
          : "border-ink-deep/15 text-ink-soft hover:bg-black/5"
      }`}
    >
      {children}
    </button>
  );
}

function Section({
  title,
  count,
  accent,
  empty,
  children,
}: {
  title: string;
  count: number;
  accent?: boolean;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2
          className={`font-body text-[11px] uppercase tracking-label ${
            accent ? "text-amber-700" : "text-clay"
          }`}
        >
          {title}
        </h2>
        <span className="font-body text-[12px] text-ink-soft/50">{count}</span>
      </div>
      {count === 0 ? (
        <EmptyState text={empty} />
      ) : (
        <div className="flex flex-col gap-3">{children}</div>
      )}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-ink-deep/15 px-4 py-6 text-center font-body text-[13px] text-ink-soft/50">
      {text}
    </p>
  );
}

function AppointmentCard({
  a,
  prominent,
}: {
  a: AppointmentRow;
  prominent?: boolean;
}) {
  const name = a.customer?.ad ?? "— (müşteri silinmiş)";
  return (
    <div
      className={`overflow-hidden rounded-xl bg-white shadow-sm ${
        prominent
          ? "border-l-4 border-amber-400 ring-1 ring-amber-200"
          : "border border-ink-deep/10"
      }`}
    >
      <Link
        href={`/yonetim/randevu/${a.id}`}
        className="block px-4 pt-4 pb-3 transition-colors hover:bg-black/[0.015]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate font-display text-[17px] font-medium text-ink-deep">
              {name}
            </div>
            {a.customer && (
              <div className="mt-0.5 font-body text-[13px] text-ink-soft/60">
                <PhoneText phone={a.customer.telefon} />
              </div>
            )}
          </div>
          <StatusBadge durum={a.durum} />
        </div>
        <div className="mt-3 flex items-center gap-2 font-body text-[13px] text-ink-soft">
          <span className="font-medium text-ink-deep">
            {dayLabel(a.tarih)} · {a.saat}
          </span>
          <span className="text-ink-soft/30">·</span>
          <span className="text-ink-soft/60">{SOURCE_LABEL[a.kaynak]}</span>
        </div>
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-deep/5 px-4 py-2.5">
        {a.customer ? (
          <PhoneActions phone={a.customer.telefon} />
        ) : (
          <span />
        )}
        {a.durum === "bekliyor" && (
          <div className="flex gap-2">
            <QuickAction id={a.id} to="onaylandi" tone="positive">
              Onayla
            </QuickAction>
            <QuickAction id={a.id} to="iptal" tone="danger">
              Reddet
            </QuickAction>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickAction({
  id,
  to,
  tone,
  children,
}: {
  id: string;
  to: AppointmentStatus;
  tone: "positive" | "danger";
  children: React.ReactNode;
}) {
  const cls =
    tone === "positive"
      ? "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600"
      : "border-rose-300 bg-white text-rose-700 hover:bg-rose-50";
  return (
    <form action={setAppointmentStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="durum" value={to} />
      <button
        type="submit"
        className={`rounded-md border px-4 py-2 font-body text-[13px] font-medium transition-colors ${cls}`}
      >
        {children}
      </button>
    </form>
  );
}
