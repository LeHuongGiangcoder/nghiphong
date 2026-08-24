/**
 * Hand-drawn-feeling line flourishes. All of them are single-stroke SVG paths
 * with round caps and no fill, so they read as one continuous pen line and
 * scale to any width without going chunky.
 */

type Props = { className?: string };

/** A long soft wave that dips through a small heart at its middle. */
export function WaveHeart({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 44"
      role="presentation"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      {/* left sweep → into the heart's left lobe */}
      <path d="M2 30 C 40 30, 74 8, 108 8 C 132 8, 146 20, 152 30" />
      {/* the heart: two lobes meeting in a point at the bottom */}
      <path d="M152 30 C 146 20, 150 12, 156 12 C 160 12, 162 15, 162 18 C 162 15, 164 12, 168 12 C 174 12, 178 20, 172 30 C 169 35, 165 38, 162 41 C 159 38, 155 35, 152 30 Z" />
      {/* right sweep out of the heart */}
      <path d="M172 30 C 178 20, 192 8, 216 8 C 250 8, 282 30, 318 30" />
    </svg>
  );
}

/** A short centred sprig — used where a full wave would be too much. */
export function Sprig({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 24"
      role="presentation"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    >
      <path d="M2 12 C 28 12, 40 4, 54 4 C 58 4, 60 7, 60 10" />
      <path d="M118 12 C 92 12, 80 4, 66 4 C 62 4, 60 7, 60 10" />
      <path d="M60 10 C 57 13, 57 17, 60 20 C 63 17, 63 13, 60 10 Z" />
    </svg>
  );
}
