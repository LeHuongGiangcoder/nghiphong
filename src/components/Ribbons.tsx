/**
 * The dress-code palette as a garland: one ribbon bow per colour, strung on a
 * single pen line that dips between them.
 */

type Props = { colors: string[]; className?: string };

const W = 320; // viewBox width
const KNOT_Y = 24; // where each bow is tied onto the string
const SAG = 14; // how far the string dips between two bows

/* One bow, drawn around its knot at (0, 0). */
const LOOP_L = "M -3 -1 C -12 -17, -31 -21, -31 -6 C -31 6, -15 8, -3 2 Z";
const LOOP_R = "M 3 -1 C 12 -17, 31 -21, 31 -6 C 31 6, 15 8, 3 2 Z";
const TAIL_L = "M -2 3 C -6 13, -11 24, -18 36 L -11 34 L -7 41 C -3 28, 0 15, 1 4 Z";
const TAIL_R = "M 2 3 C 5 14, 10 26, 14 38 L 17 31 L 23 33 C 15 23, 8 12, 3 3 Z";
const FOLD_L = "M -4 0 C -12 -5, -20 -7, -27 -6";
const FOLD_R = "M 4 0 C 12 -5, 20 -7, 27 -6";

export function Ribbons({ colors, className }: Props) {
  const step = W / colors.length;
  const xs = colors.map((_, i) => step / 2 + i * step);

  // the string: in from the left edge, scalloped through every knot, out right
  let string = `M 0 ${KNOT_Y - 8}`;
  const points = [0, ...xs, W];
  for (let i = 1; i < points.length; i++) {
    const x0 = points[i - 1];
    const x1 = points[i];
    const y0 = i === 1 ? KNOT_Y - 8 : KNOT_Y;
    const y1 = i === points.length - 1 ? KNOT_Y - 8 : KNOT_Y;
    string += ` C ${x0 + (x1 - x0) / 3} ${y0 + SAG}, ${x1 - (x1 - x0) / 3} ${y1 + SAG}, ${x1} ${y1}`;
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} 72`}
      role="presentation"
      aria-hidden="true"
    >
      <path
        d={string}
        fill="none"
        stroke="var(--c-gold-soft)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
      {colors.map((color, i) => (
        <g
          key={color}
          transform={`translate(${xs[i]} ${KNOT_Y}) rotate(${i % 2 === 0 ? -4 : 5}) scale(0.82)`}
          fill={color}
          stroke="var(--c-gold-soft)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        >
          <path d={TAIL_L} />
          <path d={TAIL_R} />
          <path d={LOOP_L} />
          <path d={LOOP_R} />
          <path d={FOLD_L} fill="none" opacity="0.6" />
          <path d={FOLD_R} fill="none" opacity="0.6" />
          <ellipse cx="0" cy="0.5" rx="4.2" ry="5" />
        </g>
      ))}
    </svg>
  );
}
