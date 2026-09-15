"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { TIMELINE_START_OFFSET } from "@/components/Timeline";
import styles from "./DateThread.module.css";

/* The wedding week, Monday 7 → Sunday 13 December 2026. */
const WEEK = [7, 8, 9, 10, 11, 12, 13];
const WEDDING_DAY = 13;

/**
 * The wedding week as a calendar row. The wedding day sits in a heart, and a
 * single pen line drops from the heart's point into the top of the timeline
 * below — so the date and the schedule read as one thread.
 *
 * Render it directly above <Timeline>, with no gap between the two: the line
 * ends on this block's bottom edge, exactly where the timeline's curve begins.
 */
export function DateThread({ month, weekdays }: { month: string; weekdays: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<SVGSVGElement>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const heart = heartRef.current;
    if (!wrap || !heart) return;

    const measure = () => {
      const a = wrap.getBoundingClientRect();
      const b = heart.getBoundingClientRect();
      setGeo({
        w: a.width,
        h: a.height,
        x: b.left + b.width / 2 - a.left,
        // the heart's point is its bottom edge
        y: b.bottom - a.top,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  let path = "";
  if (geo) {
    const tx = geo.w / 2 + TIMELINE_START_OFFSET;
    const dy = geo.h - geo.y;
    path = `M ${geo.x} ${geo.y} C ${geo.x} ${geo.y + dy * 0.6}, ${tx} ${geo.h - dy * 0.55}, ${tx} ${geo.h}`;
  }

  return (
    <div className={styles.wrap} ref={wrapRef} aria-hidden="true">
      <p className={`num ${styles.month}`}>{month}</p>

      <ol className={styles.week}>
        {WEEK.map((day, i) => {
          const isWedding = day === WEDDING_DAY;
          return (
            <li key={day} className={styles.day}>
              <span className={styles.weekday}>{weekdays[i]}</span>
              <span className={`num script--latin ${styles.date}`} data-wedding={isWedding || undefined}>
                {isWedding && (
                  <svg ref={heartRef} className={styles.heart} viewBox="0 0 40 38">
                    <path d="M20 37 C 14 31, 1 23, 1 12 C 1 5, 6 1, 11.5 1 C 15.5 1, 18.5 3.5, 20 7 C 21.5 3.5, 24.5 1, 28.5 1 C 34 1, 39 5, 39 12 C 39 23, 26 31, 20 37 Z" />
                  </svg>
                )}
                <span className={styles.dateNum}>{day}</span>
              </span>
            </li>
          );
        })}
      </ol>

      {geo && (
        <svg
          className={styles.line}
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        >
          <path d={path} />
        </svg>
      )}
    </div>
  );
}
