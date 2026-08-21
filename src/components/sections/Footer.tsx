"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import styles from "./Footer.module.css";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className={`section section--tight center ${styles.footer}`}>
      <Image
        className={styles.flourish}
        src="/decor/flourish-gold.webp"
        alt=""
        width={700}
        height={595}
      />
      <p className={`script script--latin ${styles.names}`}>{t.footer.line}</p>
      <p className={`num caption ${styles.date}`}>{t.footer.date}</p>
    </footer>
  );
}
