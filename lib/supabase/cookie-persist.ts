import type { CookieOptions } from "@supabase/ssr";

/**
 * "Bu cihaza güven" — controls how long the admin session survives.
 *
 * When the flag is set, Supabase's auth cookies (sb-*) get a long, explicit
 * maxAge so the login persists for weeks (survives PWA/browser restarts — the
 * refresh token is refreshed on every /yonetim visit by the middleware). When
 * it's not set, the lifetime is stripped so they become session cookies that
 * die when the browser session ends.
 *
 * This is deliberately just a convenience layer; a real second factor
 * (biometrics/PIN) is a later phase.
 */
export const TRUST_COOKIE = "aa_trust_device";

// ~400 days — the browser cap for persistent cookies.
export const TRUST_MAX_AGE = 60 * 60 * 24 * 400;

/** Adjust an auth cookie's lifetime for the chosen persistence. */
export function withPersistence(
  options: CookieOptions | undefined,
  persistent: boolean
): CookieOptions {
  const base = { ...(options ?? {}) };
  if (persistent) {
    return { ...base, maxAge: TRUST_MAX_AGE, expires: undefined };
  }
  // Session cookie: no maxAge/expires → cleared when the browser session ends.
  delete base.maxAge;
  delete base.expires;
  return base;
}

/** True when the request/store carries the "trust this device" flag. */
export function trustFromValue(value: string | undefined): boolean {
  return value === "1";
}
