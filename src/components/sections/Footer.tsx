"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { Vanilla } from "@/components/Vanilla";
import { DISPLAY_NAMES } from "@/content/copy";
import styles from "./Footer.module.css";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className={`section section--tight center ${styles.footer}`}>
      <div className="section-bg">
        <Image
          src="/decor/panel-hero.webp"
          alt=""
          fill
          sizes="(max-width: 40rem) 100vw, 40rem"
          style={{ objectFit: "cover" }}
        />
      </div>
      <Vanilla className={styles.flourish} />

      {/* The closing thank-you. It sits between the vanilla and the monogram so
          the footer reads as the couple signing off — motif, words, mark. */}
      <Reveal className={`measure ${styles.thanks}`}>
        {t.footer.thanks.map((line) => (
          <p className="body" key={line}>
            {line}
          </p>
        ))}
      </Reveal>

      <p className={styles.names}>
        <span className="sr-only">
          {DISPLAY_NAMES.bride} &amp; {DISPLAY_NAMES.groom}
        </span>
        <span className={styles.monogram} aria-hidden="true" />
      </p>

    </footer>
  );
}
