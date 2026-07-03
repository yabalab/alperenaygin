"use client";

import { useActionState, useEffect, useState } from "react";
import { updateCustomer, type UpdateCustomerState } from "@/app/yonetim/actions";
import { sanitizeTrPhone, formatTrPhone } from "@/lib/phone";

const initial: UpdateCustomerState = { ok: false, error: null };

export default function EditCustomerForm({
  id,
  ad,
  telefon,
}: {
  id: string;
  ad: string;
  telefon: string;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(ad);
  const [phone, setPhone] = useState(telefon); // raw digits
  const [state, formAction, pending] = useActionState(updateCustomer, initial);

  // Collapse once a save succeeds.
  useEffect(() => {
    if (state.ok) setEditing(false);
  }, [state.ok]);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setName(ad);
          setPhone(telefon);
          setEditing(true);
        }}
        className="font-body text-[12px] text-ink-soft underline transition-colors hover:text-ink-deep"
      >
        Bilgileri düzenle
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="ad" value={name} />
      <input type="hidden" name="telefon" value={phone} />

      <label className="flex flex-col gap-1.5">
        <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/50">
          Ad
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-ink-deep/15 bg-white px-3 py-2.5 font-body text-[15px] outline-none focus:border-gold"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/50">
          Telefon
        </span>
        <input
          type="tel"
          inputMode="numeric"
          value={formatTrPhone(phone)}
          onChange={(e) => setPhone(sanitizeTrPhone(e.target.value))}
          className="w-full rounded-lg border border-ink-deep/15 bg-white px-3 py-2.5 font-body text-[15px] tabular-nums outline-none focus:border-gold"
        />
      </label>

      {state.error && (
        <p className="font-body text-[13px] text-rose-700">{state.error}</p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-ink-deep px-4 py-2.5 font-body text-[12px] uppercase tracking-label text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="font-body text-[12px] text-ink-soft underline hover:text-ink-deep"
        >
          Vazgeç
        </button>
      </div>
    </form>
  );
}
