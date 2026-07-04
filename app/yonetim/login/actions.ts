"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { TRUST_COOKIE, TRUST_MAX_AGE } from "@/lib/supabase/cookie-persist";

export type LoginState = { error: string | null };

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  // Checkbox present in the form data ⇒ "trust this device" (long session).
  const trust = formData.get("trust") != null;

  if (!email || !password) {
    return { error: "E-posta ve şifre gerekli." };
  }

  // Record the preference BEFORE signing in, so the auth cookies written during
  // sign-in inherit the right lifetime (and the middleware keeps honoring it).
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  cookieStore.set(TRUST_COOKIE, trust ? "1" : "0", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    ...(trust ? { maxAge: TRUST_MAX_AGE } : {}), // else: session cookie
  });

  const supabase = await createServerSupabase(trust);
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately vague — don't reveal whether the e-posta exists.
    return { error: "E-posta veya şifre hatalı." };
  }

  // Refresh server-rendered pages so they pick up the new session cookie.
  revalidatePath("/yonetim", "layout");
  redirect("/yonetim");
}
