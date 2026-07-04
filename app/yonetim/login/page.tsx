"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="min-h-svh bg-paper text-ink-deep flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-body text-[11px] uppercase tracking-label text-clay">
            Alperen Aygın
          </p>
          <h1 className="font-display text-3xl font-light tracking-tight mt-3">
            Yönetim
          </h1>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/70">
              E-posta
            </span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className="w-full rounded-none border border-ink-deep/15 bg-card-cream px-4 py-3 font-body text-[15px] text-ink-deep outline-none transition-colors focus:border-gold"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-body text-[11px] uppercase tracking-label text-ink-soft/70">
              Şifre
            </span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full rounded-none border border-ink-deep/15 bg-card-cream px-4 py-3 font-body text-[15px] text-ink-deep outline-none transition-colors focus:border-gold"
            />
          </label>

          <label className="flex items-center gap-2.5 select-none">
            <input
              type="checkbox"
              name="trust"
              defaultChecked
              className="h-4 w-4 accent-ink-deep"
            />
            <span className="font-body text-[13px] text-ink-soft/80">
              Bu cihaza güven — uzun süre girişli kal
            </span>
          </label>

          {state.error && (
            <p className="font-body text-[13px] text-red-700">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full bg-ink-deep px-4 py-3 font-body text-[12px] uppercase tracking-label text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Giriş yapılıyor…" : "Giriş yap"}
          </button>
        </form>
      </div>
    </main>
  );
}
