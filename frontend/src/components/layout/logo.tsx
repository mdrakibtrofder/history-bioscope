export function Logo({ className = 'size-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="hb-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a2fc0" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#hb-g)" />
      <circle cx="20" cy="20" r="10.5" fill="none" stroke="white" strokeWidth="2" opacity="0.95" />
      <path d="M9.5 20h21M20 9.5c3.2 3 4.8 6.5 4.8 10.5S23.2 27.5 20 30.5M20 9.5c-3.2 3-4.8 6.5-4.8 10.5s1.6 7.5 4.8 10.5" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" />
      <circle cx="20" cy="20" r="2.6" fill="white" />
    </svg>
  );
}
