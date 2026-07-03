import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs on every /yonetim request: refreshes the admin session cookies (so the
 * long-lived login stays valid) and guards the panel. No session → bounce to
 * the login page; already logged in and sitting on /login → send to the panel.
 *
 * IMPORTANT: always return `supabaseResponse` (or a redirect built from it) so
 * the refreshed auth cookies survive. Rebuilding the response elsewhere would
 * drop them and silently log the admin out.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do NOT run any code between createServerClient and getUser() — it refreshes
  // the token and any short-circuit here risks logging the user out at random.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === "/yonetim/login";

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/yonetim/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/yonetim";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
