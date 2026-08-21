"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import styles from "./Nav.module.css";

const SECTIONS = ["greeting", "agenda", "rsvp"] as const;

export function Nav() {
  const { t, lang, toggle } = useLang();
  const [lifted, setLifted] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // The bar only appears once the hero has scrolled past.
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observed = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (observed.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.25, 0.6], rootMargin: "-20% 0px -40% 0px" },
    );

    observed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className={styles.bar} data-lifted={lifted}>
      <nav className={styles.inner} aria-label={t.nav.rsvp}>
        <ul className={styles.links}>
          {SECTIONS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={styles.link}
                aria-current={active === id ? "true" : undefined}
              >
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`btn btn--ghost btn--sm ${styles.lang}`}
          onClick={toggle}
          lang={lang === "en" ? "vi" : "en"}
        >
          {t.langLabel}
        </button>
      </nav>
    </header>
  );
}
