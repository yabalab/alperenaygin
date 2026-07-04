import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { TRUST_COOKIE, trustFromValue, withPersistence } from "./cookie-persist";

/**
 * Server Supabase client (anon key, RLS-gated) with cookie-based auth for
 * Server Components, Server Actions and Route Handlers. Reads/refreshes the
 * admin session from cookies.
 *
 * `persistentOverride` forces the session-cookie lifetime (used at login, where
 * the "trust this device" cookie isn't reliably readable yet); otherwise the
 * lifetime follows the stored TRUST_COOKIE flag.
 */
export async function createServerSupabase(persistentOverride?: boolean) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          const persistent =
            persistentOverride ??
            trustFromValue(cookieStore.get(TRUST_COOKIE)?.value);
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(
                name,
                value,
                name.startsWith("sb-")
                  ? withPersistence(options, persistent)
                  : options
              )
            );
          } catch {
            // Called from a Server Component (cookies are read-only there);
            // the middleware refreshes the session cookies instead.
          }
        },
      },
    }
  );
}
