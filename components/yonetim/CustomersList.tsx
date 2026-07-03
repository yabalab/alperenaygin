"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CustomerListRow } from "@/lib/crm/types";
import { dayLabel } from "@/lib/crm/format";
import { formatTrPhone } from "@/lib/phone";

type Sort = "recent" | "count" | "name";

const SORTS: { key: Sort; label: string }[] = [
  { key: "recent", label: "Son randevu" },
  { key: "count", label: "En çok gelen" },
  { key: "name", label: "Ad" },
];

function trLower(s: string) {
  return s.toLocaleLowerCase("tr");
}

export default function CustomersList({
  customers,
}: {
  customers: CustomerListRow[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("recent");

  const rows = useMemo(() => {
    const qName = trLower(query.trim());
    const qDigits = query.replace(/\D/g, "");
    const filtered = customers.filter((c) => {
      if (!query.trim()) return true;
      const nameHit = trLower(c.ad).includes(qName);
      const phoneHit =
        qDigits.length > 0 && c.telefon.replace(/\D/g, "").includes(qDigits);
      return (qName && nameHit) || phoneHit;
    });

    const sorted = [...filtered];
    if (sort === "recent") {
      sorted.sort((a, b) => (b.lastAppt ?? "").localeCompare(a.lastAppt ?? ""));
    } else if (sort === "count") {
      sorted.sort((a, b) => b.total - a.total || a.ad.localeCompare(b.ad, "tr"));
    } else {
      sorted.sort((a, b) => a.ad.localeCompare(b.ad, "tr"));
    }
    return sorted;
  }, [customers, query, sort]);

  return (
    <div>
      <input
        type="search"
        placeholder="İsim veya telefon ara…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg border border-ink-deep/15 bg-white px-4 py-3 font-body text-[15px] outline-none transition-colors focus:border-gold"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/50">
          Sırala
        </span>
        {SORTS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSort(s.key)}
            className={`rounded-full border px-3.5 py-1.5 font-body text-[12px] transition-colors ${
              sort === s.key
                ? "border-ink-deep bg-ink-deep text-paper"
                : "border-ink-deep/15 text-ink-soft hover:bg-black/5"
            }`}
          >
            {s.label}
          </button>
        ))}
        <span className="ml-auto font-body text-[12px] text-ink-soft/40">
          {rows.length} müşteri
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-ink-deep/15 px-4 py-6 text-center font-body text-[13px] text-ink-soft/50">
            Müşteri bulunamadı.
          </p>
        ) : (
          rows.map((c) => (
            <Link
              key={c.id}
              href={`/yonetim/musteriler/${c.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-ink-deep/10 bg-white px-4 py-3 shadow-sm transition-colors hover:border-ink-deep/25"
            >
              <div className="min-w-0">
                <div className="truncate font-display text-[16px] font-medium text-ink-deep">
                  {c.ad}
                </div>
                <div className="mt-0.5 font-body text-[13px] text-ink-soft/60 tabular-nums">
                  {formatTrPhone(c.telefon)}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-body text-[13px] text-ink-deep">
                  {c.total} randevu
                </div>
                <div className="mt-0.5 font-body text-[12px] text-ink-soft/50">
                  {c.lastAppt ? dayLabel(c.lastAppt) : "—"}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
