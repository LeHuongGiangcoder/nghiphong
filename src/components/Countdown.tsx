"use client";

import { useSyncExternalStore } from "react";
import { useLang } from "@/components/LanguageProvider";
import { WEDDING_DATE_ISO } from "@/content/copy";
import styles from "./Countdown.module.css";

const TARGET = new Date(WEDDING_DATE_ISO).getTime();

/* The clock is external state. getSnapshot is bucketed to whole seconds and
   memoised so React sees a stable value within a render pass; the server
   snapshot is -1, meaning "not counted yet". */

let cachedSeconds = -1;

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

function getSnapshot() {
  const seconds = Math.max(0, Math.floor((TARGET - Date.now()) / 1000));
  if (seconds !== cachedSeconds) cachedSeconds = seconds;
  return cachedSeconds;
}

function getServerSnapshot() {
  return -1;
}

export function Countdown() {
  const { t } = useLang();
  const total = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const pending = total < 0;

  if (total === 0) {
    return <p className={`caption ${styles.over}`}>{t.countdown.over}</p>;
  }

  const cells = [
    { value: Math.floor(total / 86_400), label: t.countdown.days },
    { value: Math.floor(total / 3_600) % 24, label: t.countdown.hours },
    { value: Math.floor(total / 60) % 60, label: t.countdown.minutes },
    { value: total % 60, label: t.countdown.seconds },
  ];

  return (
    <ul className={styles.grid} aria-live="off">
      {cells.map(({ value, label }) => (
        <li key={label} className={styles.cell}>
          <span className={`num script--latin ${styles.value}`}>
            {pending ? "––" : String(value).padStart(2, "0")}
          </span>
          <span className={styles.label}>{label}</span>
        </li>
      ))}
    </ul>
  );
}
