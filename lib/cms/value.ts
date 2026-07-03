// site_content.value holds language JSON: {"tr": "...", "en": null}.
// These helpers pack/unpack it. Pure — usable in server code and scripts.

export type ContentValue = { tr: string | null; en: string | null };

export function packValue(tr: string, en: string | null = null): string {
  return JSON.stringify({ tr, en } satisfies ContentValue);
}

/** Extract the TR string. Tolerates legacy plain-text values. */
export function unpackTr(value: string | null | undefined): string | null {
  if (value == null || value === "") return null;
  try {
    const o = JSON.parse(value) as Partial<ContentValue>;
    return typeof o?.tr === "string" && o.tr !== "" ? o.tr : null;
  } catch {
    return value; // legacy plain string
  }
}

/** Extract the EN string (null when unset) — for the future EN editor. */
export function unpackEn(value: string | null | undefined): string | null {
  if (value == null || value === "") return null;
  try {
    const o = JSON.parse(value) as Partial<ContentValue>;
    return typeof o?.en === "string" && o.en !== "" ? o.en : null;
  } catch {
    return null;
  }
}
