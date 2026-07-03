import { createServerSupabase } from "@/lib/supabase/server";
import { logout } from "./actions";

export default async function YonetimPage() {
  // Middleware already guards this route; we read the user here just to greet.
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-svh bg-paper text-ink-deep">
      <header className="border-b border-ink-deep/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-body text-[11px] uppercase tracking-label text-clay">
              Alperen Aygın
            </p>
            <h1 className="font-display text-xl font-light tracking-tight mt-1">
              Yönetim Paneli
            </h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="border border-ink-deep/20 px-4 py-2 font-body text-[11px] uppercase tracking-label text-ink-soft transition-colors hover:border-ink-deep hover:text-ink-deep"
            >
              Çıkış
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <p className="font-body text-[13px] text-ink-soft/70">
          Giriş yapıldı{user?.email ? ` — ${user.email}` : ""}.
        </p>
        <p className="font-display text-2xl font-light tracking-tight mt-4">
          Panel içeriği yakında.
        </p>
      </div>
    </main>
  );
}
