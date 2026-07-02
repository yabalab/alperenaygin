/**
 * Turkish mobile phone masking — hand-rolled (no mask library).
 * Rules: starts with 0, second digit is 5, 11 digits total.
 * Display format: "05XX XXX XX XX".
 */

/** Keep only valid digits for a TR mobile number. Returns up to 11 raw digits. */
export function sanitizeTrPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  // Friendly: a number typed/pasted without the leading 0 (starts with "5").
  if (digits.length > 0 && digits[0] === "5") digits = "0" + digits;
  // Also handle a pasted +90 / 90 country prefix.
  if (digits.startsWith("90")) digits = "0" + digits.slice(2);

  let out = "";
  for (const c of digits) {
    const i = out.length;
    if (i === 0 && c !== "0") continue; // first must be 0
    if (i === 1 && c !== "5") continue; // second must be 5
    out += c;
    if (out.length === 11) break;
  }
  return out;
}

/** Format raw digits into "05XX XXX XX XX" (partial-friendly). */
export function formatTrPhone(digits: string): string {
  return [
    digits.slice(0, 4),
    digits.slice(4, 7),
    digits.slice(7, 9),
    digits.slice(9, 11),
  ]
    .filter(Boolean)
    .join(" ");
}

/** A complete, valid TR mobile number. */
export function isValidTrPhone(digits: string): boolean {
  return /^05\d{9}$/.test(digits);
}
