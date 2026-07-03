import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client — uses the SERVICE ROLE key and BYPASSES Row Level
 * Security. Use ONLY inside Server Actions / Route Handlers for trusted,
 * server-validated writes (e.g. creating an appointment from the booking form).
 *
 * The `server-only` import makes the build fail if this module is ever pulled
 * into a client bundle, so the service_role key can never reach the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin env vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
