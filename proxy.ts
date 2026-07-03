import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 renamed the `middleware` convention to `proxy`.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only the admin panel needs auth; the public site is untouched.
  // `:path*` also matches /yonetim itself.
  matcher: ["/yonetim/:path*"],
};
