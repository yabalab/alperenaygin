// Seed site_content with the current Turkish defaults (value = {tr, en} JSON).
//   node scripts/seed-content.mjs
//
// OPTIONAL: the site already falls back to the in-code defaults
// (lib/cms/content.ts) for any key not in the DB, so seeding is not required for
// the site to render. Run this to pre-populate every key in the DB (e.g. so the
// panel shows them all as saved). Idempotent (upsert on key). Sources defaults
// from the registry so it never drifts.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { CONTENT_DEFAULTS } from "../lib/cms/content.ts";

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

const rows = Object.entries(CONTENT_DEFAULTS).map(([key, tr]) => ({
  key,
  value: JSON.stringify({ tr, en: null }),
  grup: key.split(".")[0],
}));

const { error } = await supabase
  .from("site_content")
  .upsert(rows, { onConflict: "key" });

console.log(error ? "ERROR " + error.message : `seeded ${rows.length} content keys`);
