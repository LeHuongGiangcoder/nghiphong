"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { INITIALS, DISPLAY_NAMES } from "@/content/copy";
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
      <Image
        className={styles.flourish}
        src="/component/vanilla.png"
        alt=""
        width={2813}
        height={2813}
      />
      <p className={`script script--latin ${styles.names}`}>
        <span className="sr-only">
          {DISPLAY_NAMES.bride} &amp; {DISPLAY_NAMES.groom}
        </span>
        <span aria-hidden="true">
          {INITIALS.bride} &amp; {INITIALS.groom}
        </span>
      </p>
      <p className={`num script--latin caption ${styles.date}`}>{t.footer.date}</p>

      <Reveal className={styles.couple}>
        <Image
          src="/component/couple.png"
          alt="Hands of the couple"
          width={2160}
          height={728}
        />
      </Reveal>
    </footer>
  );
}
