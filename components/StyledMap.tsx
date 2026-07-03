// Stylised, on-palette map illustration (NO live colourful Google embed — that
// would break the cream aesthetic). It's a hand-drawn cream/sepia street
// abstraction with a gold pin. The "Yol tarifi al" button opens real Google
// Maps directions.
//
// Backend/config: when the exact address/coords are known, (a) swap DESTINATION
// below, and optionally (b) replace the SVG with a Google Static Maps image
// using a cream custom style + your API key — the layout stays the same.

// TODO: update with the real address or "lat,lng" once confirmed.
const DESTINATION = "Serdivan, Sakarya";
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  DESTINATION
)}`;

export default function StyledMap() {
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[8px] border border-[rgba(35,28,20,0.12)]">
      <svg
        viewBox="0 0 400 267"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden="true"
      >
        <rect width="400" height="267" fill="#F1EADD" />

        {/* city blocks */}
        <g fill="#E7DDC9">
          <rect x="18" y="20" width="86" height="60" rx="4" />
          <rect x="128" y="16" width="104" height="48" rx="4" />
          <rect x="262" y="26" width="120" height="66" rx="4" />
          <rect x="26" y="116" width="76" height="78" rx="4" />
          <rect x="252" y="126" width="130" height="52" rx="4" />
          <rect x="54" y="214" width="120" height="44" rx="4" />
          <rect x="232" y="206" width="150" height="52" rx="4" />
        </g>

        {/* a quiet park / green square, still in a muted sepia-green */}
        <rect x="150" y="118" width="72" height="62" rx="8" fill="#DEE1D0" />

        {/* minor streets */}
        <g stroke="#8A6F4F" strokeOpacity="0.26" strokeWidth="2">
          <path d="M0 192 H400" />
          <path d="M0 148 H400" />
          <path d="M60 0 V267" />
          <path d="M244 0 V267" />
        </g>

        {/* main avenues */}
        <g stroke="#B8956A" strokeOpacity="0.55" strokeWidth="6" strokeLinecap="round">
          <path d="M0 100 H400" />
          <path d="M118 0 V267" />
          <path d="M-10 34 L410 236" />
        </g>
      </svg>

      {/* location pin (centred on the block/park junction) */}
      <div className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-[rgba(184,149,106,0.35)]" />
        <span className="relative block h-[14px] w-[14px] rounded-full border-2 border-paper bg-gold shadow-[0_2px_8px_rgba(14,14,12,0.35)]" />
      </div>

      {/* directions CTA */}
      <a
        href={DIRECTIONS_URL}
        target="_blank"
        rel="noopener"
        className="absolute bottom-3 left-3 inline-flex items-center gap-[8px] rounded-full bg-ink-deep px-[16px] pb-[9px] pt-[10px] font-body text-[9.5px] font-light uppercase tracking-label text-paper shadow-[0_8px_24px_rgba(14,14,12,0.2)] transition-colors duration-500 ease-smooth hover:bg-clay"
      >
        Yol tarifi al{" "}
        <span className="font-accent text-[13px] tracking-normal">→</span>
      </a>
    </div>
  );
}
