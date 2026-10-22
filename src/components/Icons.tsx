import type { JSX } from "react";

/* Hand-drawn inline SVG icon set â€” stroked, inherits currentColor */

const P: Record<string, JSX.Element> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
    </>
  ),
  bolt: <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />,
  rocket: (
    <>
      <path d="M12 2c3.5 1.5 5.5 5 5.5 9l-2.5 3h-6L6.5 11C6.5 7 8.5 3.5 12 2Z" />
      <circle cx="12" cy="9" r="1.8" />
      <path d="M9 14l-2.5 4L10 17M15 14l2.5 4L14 17M12 15v6" />
    </>
  ),
  gamepad: (
    <>
      <path d="M6.5 7h11a4.5 4.5 0 0 1 4.4 5.6l-1 4a2.8 2.8 0 0 1-4.9 1L14.5 16h-5L8 17.6a2.8 2.8 0 0 1-4.9-1l-1-4A4.5 4.5 0 0 1 6.5 7Z" />
      <path d="M8 10v4M6 12h4M15.5 10.5h.01M18 13h.01" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8 13.6 5h2.7l.9 2.5 2.4 1-.3 2.7 1.9 2-1.9 2 .3 2.7-2.4 1-.9 2.5h-2.7L12 21.2 10.4 19H7.7l-.9-2.5-2.4-1 .3-2.7-1.9-2 1.9-2-.3-2.7 2.4-1L7.7 5h2.7L12 2.8Z" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z" />
      <path d="M9.8 19a2.3 2.3 0 0 0 4.4 0" />
    </>
  ),
  crown: <path d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-1.6 10H4.6L3 8Z" />,
  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0 1 19 0" />
      <path d="M5.5 12.5a10 10 0 0 1 13 0" />
      <path d="M8.5 16a5.5 5.5 0 0 1 7 0" />
      <circle cx="12" cy="19.4" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  upload: (
    <>
      <path d="M12 21V10" />
      <path d="m7 14 5-5 5 5" />
      <path d="M4 4h16" />
    </>
  ),
  ping: (
    <>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9" />
      <path d="M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8" />
    </>
  ),
  bars: (
    <>
      <path d="M4 20v-4M9 20v-8M14 20V7M19 20V3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.8 2.6 4 5.8 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.8-4-9s1.2-6.4 4-9Z" />
    </>
  ),
  antenna: (
    <>
      <path d="M12 10v11" />
      <circle cx="12" cy="8" r="2" />
      <path d="M7.8 3.8a7 7 0 0 0 0 8.4M16.2 3.8a7 7 0 0 1 0 8.4" />
      <path d="M8.5 21h7" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="17.5" cy="5.5" r="2.6" />
      <circle cx="17.5" cy="18.5" r="2.6" />
      <path d="m8.4 10.7 6.8-3.9M8.4 13.3l6.8 3.9" />
    </>
  ),
  play: <path d="M7 4.5v15l13-7.5-13-7.5Z" />,
  check: <path d="m4.5 12.5 5 5L19.5 6.5" />,
  close: <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />,
  shield: (
    <>
      <path d="M12 2.5 20 6v6c0 5-3.4 8.2-8 9.5C7.4 20.2 4 17 4 12V6l8-3.5Z" />
      <path d="m8.8 12 2.2 2.2 4.4-4.6" />
    </>
  ),
  wrench: (
    <path d="M14.5 6.5a4.5 4.5 0 0 1 5.7-4.3L17 5.4l1.6 1.6 3.2-3.2a4.5 4.5 0 0 1-6 5.9L7 18.5a2 2 0 0 1-2.8-2.8l8.8-8.8a4.5 4.5 0 0 1 1.5-.4Z" />
  ),
  skull: (
    <>
      <path d="M12 2.5a8 8 0 0 0-8 8c0 2.5 1.2 4.4 3 5.7V19a2.5 2.5 0 0 0 2.5 2.5h5A2.5 2.5 0 0 0 17 19v-2.8c1.8-1.3 3-3.2 3-5.7a8 8 0 0 0-8-8Z" />
      <circle cx="9" cy="11" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="11" r="1.6" fill="currentColor" stroke="none" />
      <path d="M10.5 21.5v-2M13.5 21.5v-2" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 9.5v4.5l3 2M9.5 2.5h5" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  heart: (
    <path d="M12 20.5C6.5 16.5 3 13.2 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.8 0 3.3 1 4.3 2.6 1-1.6 2.5-2.6 4.3-2.6 2.5 0 4.7 1.9 4.7 4.8 0 3.9-3.5 7.2-9 11.2Z" />
  ),
  star: (
    <path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7L12 3Z" />
  ),
  chevron: <path d="m9 5 7 7-7 7" />,
  refresh: (
    <>
      <path d="M20 5v5h-5" />
      <path d="M20 10a8 8 0 1 0 .8 4" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
    </>
  ),
  palette: (
    <>
      <path d="M12 21a9 9 0 1 1 9-9c0 2.5-2 3-3.5 3H15a2.5 2.5 0 0 0-2 4c.8 1.2.2 2-1 2Z" />
      <circle cx="7.8" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16.2" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  language: (
    <>
      <path d="M3 5h10M8 3v2c0 4-2 8-5 10M5 8c1.5 2.5 4 5 7 6" />
      <path d="m13 21 4-10 4 10M14.2 18h5.6" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H4.5c0 3.5 1.5 5.5 3.5 6M16 5h3.5c0 3.5-1.5 5.5-3.5 6" />
      <path d="M12 13v4M8 20h8M9.5 17h5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.8" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  flame: (
    <path d="M12 2.5c1 3-0.5 4.5-2 6C8.2 10.3 7 12 7 14.5A5.3 5.3 0 0 0 12.3 20a5.5 5.5 0 0 0 5.7-5.5c0-4-2.6-5.6-3-8.5-1.5 1-2 2.5-1.8 4C12 8 11 5.5 12 2.5Z" />
  ),
  swords: (
    <>
      <path d="M3.5 3.5 14 14M3.5 3.5H7M3.5 3.5V7M20.5 3.5 10 14M20.5 3.5H17M20.5 3.5V7" />
      <path d="m7 17-2.5 2.5M8.5 15.5l3 3M17 17l2.5 2.5M15.5 15.5l-3 3" />
    </>
  ),
  helmet: (
    <>
      <path d="M12 3a8 8 0 0 0-8 8v6l3 3v-5h10v5l3-3v-6a8 8 0 0 0-8-8Z" />
      <path d="M7 11h10" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.8" />
      <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5V17M12 7.2h.01" />
    </>
  ),
  send: <path d="M21 3 3 10.5l7 3 3 7L21 3ZM10 13.5 21 3" />,
};

export function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.8,
}: {
  name: keyof typeof P | string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {P[name] ?? P.info}
    </svg>
  );
}
