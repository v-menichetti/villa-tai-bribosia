import type { SVGProps } from 'react';
export function PingPongIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 3c-3-2-7-1-10 2s-4 7-2 10c1 2 3 3 5 3l4 4 3-3-3-4c2-1 4-3 5-5 1-3 0-5-2-7Z" />
      <path d="m4 9 11 7" />
      <circle cx="20" cy="4" r="2" />
    </svg>
  );
}
