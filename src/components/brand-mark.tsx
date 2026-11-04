/** A Mediterranean roof, cypress, evening sun and a pool reflection. */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`brand-mark ${className}`}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="56" cy="22" r="7" fill="currentColor" opacity=".75" />
      <path d="M18 48c-8-3-5-15 0-30 5 15 8 27 0 30Z" fill="currentColor" />
      <g
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 44v14M28 40l17-12 22 16M32 38v19h29V40M43 57V46h8v11M56 34v-7h4v10" />
        <path d="M11 59c14-6 23 5 37 2 9-2 14-3 21-1M21 67c13-4 21 4 37 0" />
      </g>
    </svg>
  );
}
