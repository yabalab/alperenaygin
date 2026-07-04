// Create the `site-media` storage bucket (public read; writes/deletes happen
// only server-side via the service_role key in server actions, so no anon write
// path exists). Idempotent — safe to re-run.
//   node scripts/setup-storage.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data: existing } = await supabase.storage.getBucket("site-media");
if (existing) {
  console.log("bucket 'site-media' already exists");
} else {
  const { error } = await supabase.storage.createBucket("site-media", {
    public: true,
    fileSizeLimit: "6MB",
    allowedMimeTypes: ["image/webp", "image/jpeg", "image/png"],
  });
  console.log(error ? "ERROR " + error.message : "created bucket 'site-media' (public read)");
}
