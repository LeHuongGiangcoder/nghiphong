"use client";

import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import styles from "./Timeline.module.css";

export type TimelineItem = { time: string; title: string; note: string };

/* Geometry of the ribbon. The curve column is a fixed width so the stroke is
   never scaled non-uniformly; only the labels beside it are fluid. */
const ROW = 148; // vertical distance between two events
const COL = 76; // width of the curve column
const LEFT = 20; // x of a node on the left swing
const RIGHT = COL - 20; // x of a node on the right swing
const LEAD = 62; // straight-ish run before the first node
const TAIL = 64; // run after the last node, into the heart

const nodeX = (i: number) => (i % 2 === 0 ? LEFT : RIGHT);
const nodeY = (i: number) => LEAD + i * ROW;

/**
 * Builds one continuous S-curve threading every event. Control points sit
 * directly above and below each node, which forces a vertical tangent there —
 * that is what makes the ribbon read as a single relaxed line rather than a
 * chain of arcs.
 */
function buildPath(count: number) {
  const parts = [`M ${nodeX(0)} 0`, `L ${nodeX(0)} ${nodeY(0)}`];

  for (let i = 1; i < count; i++) {
    const x0 = nodeX(i - 1);
    const y0 = nodeY(i - 1);
    const x1 = nodeX(i);
    const y1 = nodeY(i);
    const k = (y1 - y0) / 2;
    parts.push(`C ${x0} ${y0 + k}, ${x1} ${y1 - k}, ${x1} ${y1}`);
  }

  // tail: drift back to the middle and finish in a small loop
  const lastX = nodeX(count - 1);
  const lastY = nodeY(count - 1);
  const midX = COL / 2;
  parts.push(
    `C ${lastX} ${lastY + TAIL * 0.5}, ${midX} ${lastY + TAIL * 0.5}, ${midX} ${lastY + TAIL}`,
  );
  return parts.join(" ");
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  const height = LEAD + (items.length - 1) * ROW + TAIL + 26;
  const path = buildPath(items.length);
  const endY = LEAD + (items.length - 1) * ROW + TAIL;

  return (
    <div className={styles.wrap} style={{ height }}>
      <svg
        className={styles.curve}
        width={COL}
        height={height}
        viewBox={`0 0 ${COL} ${height}`}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      >
        <path d={path} />
        {/* closing heart */}
        <path
          d={`M ${COL / 2} ${endY + 16}
              C ${COL / 2 - 9} ${endY + 8}, ${COL / 2 - 9} ${endY - 2}, ${COL / 2} ${endY + 4}
              C ${COL / 2 + 9} ${endY - 2}, ${COL / 2 + 9} ${endY + 8}, ${COL / 2} ${endY + 16} Z`}
        />
      </svg>

      <ol className={styles.list}>
        {items.map((item, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          return (
            <li
              key={item.time + item.title}
              className={styles.row}
              data-side={side}
              style={{ top: nodeY(i) }}
            >
              <Reveal className={`reveal--fade ${styles.label}`} delay={i * 120}>
                <p className={`num script--latin ${styles.time}`}>{item.time}</p>
                <h3 className={`h3 ${styles.title}`}>{item.title}</h3>
                {item.note ? <p className={`small ${styles.note}`}>{item.note}</p> : null}
              </Reveal>
              <span
                className={styles.pearl}
                aria-hidden="true"
                style={{ marginLeft: `calc(50% - ${COL / 2}px + ${nodeX(i)}px)` }}
              >
                <Image src="/decor/pearl.webp" alt="" width={800} height={772} />
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
