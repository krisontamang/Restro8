export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <span className="r8-brand" aria-label="Restro8 — infinite hospitality">
    <svg viewBox="0 0 64 48" fill="none" aria-hidden="true" className="r8-brand-mark">
      <path d="M32 25C24 13 19 10 13 10C6 10 3 16 3 23s4 13 11 13c7 0 12-7 18-14C39 12 44 10 50 10c7 0 11 6 11 13s-4 13-11 13c-6 0-11-5-18-11Z" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 17v11m-4-11v5c0 3 8 3 8 0v-5M44 27a6 6 0 0 1 12 0m-14 2h16m-8-11v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    {!compact && <span className="r8-brand-word">restro<span>8</span><small>INFINITE HOSPITALITY</small></span>}
  </span>;
}
