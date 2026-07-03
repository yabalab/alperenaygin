// Seed TEST appointments (various statuses) for the CRM panel.
//   node scripts/seed-appointments.mjs         → wipe test data + reseed
//   node scripts/seed-appointments.mjs --clean → only remove test data
//
// Test rows are identified by the 0532 111 00 XX phone range, so cleanup is
// exact and never touches real customers. Uses the service_role key (server
// side only — this script never ships to the browser).
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

const TEST_PREFIX = "0532111"; // 0532 111 00 XX

function iso(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

async function clean() {
  const { data: rows } = await supabase
    .from("customers")
    .select("id, telefon")
    .like("telefon", `${TEST_PREFIX}%`);
  const ids = (rows ?? []).map((r) => r.id);
  if (ids.length) {
    // appointments + notes cascade on customer delete
    await supabase.from("customers").delete().in("id", ids);
  }
  console.log(`cleaned ${ids.length} test customer(s)`);
}

const CUSTOMERS = [
  { key: "mehmet", ad: "Mehmet Yılmaz", telefon: "05321110001" },
  { key: "ayse", ad: "Ayşe Demir", telefon: "05321110002" },
  { key: "ali", ad: "Ali Kaya", telefon: "05321110003" },
  { key: "fatma", ad: "Fatma Şahin", telefon: "05321110004" },
  { key: "hasan", ad: "Hasan Çelik", telefon: "05321110005" },
  { key: "zeynep", ad: "Zeynep Ak", telefon: "05321110006" },
  { key: "mustafa", ad: "Mustafa Öz", telefon: "05321110007" },
];

// [customerKey, tarih, saat, durum, kaynak, not_metni]
const APPOINTMENTS = [
  ["mehmet", iso(1), "11:00", "bekliyor", "site", "Kısa saç, ilk uygulama."],
  ["ayse", iso(3), "15:00", "bekliyor", "site", null],
  ["ali", iso(2), "14:00", "onaylandi", "manuel", "Telefonla arayıp aldı."],
  ["fatma", iso(0), "10:00", "onaylandi", "site", null],
  ["hasan", iso(-5), "13:00", "tamamlandi", "site", null],
  ["zeynep", iso(-3), "16:00", "iptal", "site", "Müşteri iptal etti."],
  ["mustafa", iso(-7), "12:00", "gelmedi", "manuel", null],
  // Mehmet's past visit → shows up as customer history on his detail page.
  ["mehmet", iso(-30), "11:00", "tamamlandi", "site", null],
];

async function seed() {
  await clean();

  const { data: inserted, error } = await supabase
    .from("customers")
    .insert(CUSTOMERS.map(({ ad, telefon }) => ({ ad, telefon })))
    .select("id, telefon");
  if (error) throw error;

  const idByPhone = Object.fromEntries(inserted.map((c) => [c.telefon, c.id]));
  const idByKey = Object.fromEntries(
    CUSTOMERS.map((c) => [c.key, idByPhone[c.telefon]])
  );

  const rows = APPOINTMENTS.map(([key, tarih, saat, durum, kaynak, not_metni]) => ({
    customer_id: idByKey[key],
    tarih,
    saat,
    durum,
    kaynak,
    not_metni,
  }));

  const { error: aErr } = await supabase.from("appointments").insert(rows);
  if (aErr) throw aErr;

  console.log(
    `seeded ${CUSTOMERS.length} customers, ${rows.length} appointments`
  );
}

if (process.argv.includes("--clean")) {
  await clean();
} else {
  await seed();
}
