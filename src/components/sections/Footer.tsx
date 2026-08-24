"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import styles from "./Footer.module.css";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className={`section section--tight center ${styles.footer}`}>
      <Image
        className={styles.flourish}
        src="/component/vanilla.png"
        alt=""
        width={2813}
        height={2813}
      />
      <p className={`script script--latin ${styles.names}`}>{t.footer.line}</p>
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
