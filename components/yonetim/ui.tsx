import { STATUS_META } from "@/lib/crm/status";
import type { AppointmentStatus } from "@/lib/crm/types";
import { formatTrPhone, telLink, whatsappLink } from "@/lib/phone";

// Pure presentational helpers — no "use client", safe in server or client trees.

export function StatusBadge({ durum }: { durum: AppointmentStatus }) {
  const m = STATUS_META[durum];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-body text-[11px] font-medium ${m.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 3h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 014.5 5a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.3A10 10 0 1012 2zm0 1.8a8.2 8.2 0 016.9 12.6l-.2.3.7 2.6-2.7-.7-.3.2A8.2 8.2 0 1112 3.8zm-3 3.5c-.2 0-.5 0-.7.4-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.2.2 2 3.1 5 4.3 2.4 1 2.9.8 3.5.8.5-.1 1.6-.7 1.9-1.4.2-.6.2-1.2.1-1.3l-.9-.4c-.4-.2-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.8-.3-1.5-.7-2.2-1.4-.5-.5-.9-1.1-1.3-1.7-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5v-.5c0-.2-.6-1.5-.8-2-.2-.4-.4-.4-.6-.4z" />
    </svg>
  );
}

export function PhoneActions({ phone }: { phone: string }) {
  return (
    <div className="flex items-center gap-2">
      <a
        href={telLink(phone)}
        className="inline-flex items-center gap-1.5 rounded-md border border-ink-deep/15 bg-white px-3 py-2 font-body text-[12px] text-ink-soft transition-colors hover:border-ink-deep hover:text-ink-deep"
      >
        <PhoneIcon />
        Ara
      </a>
      <a
        href={whatsappLink(phone)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-emerald-600/30 bg-emerald-50 px-3 py-2 font-body text-[12px] text-emerald-800 transition-colors hover:bg-emerald-100"
      >
        <WhatsAppIcon />
        WhatsApp
      </a>
    </div>
  );
}

/** Read-only phone as formatted text, e.g. "0532 123 45 67". */
export function PhoneText({ phone }: { phone: string }) {
  return <span className="tabular-nums">{formatTrPhone(phone)}</span>;
}
