"use client";

import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Vanilla } from "@/components/Vanilla";
import { INITIALS, DISPLAY_NAMES } from "@/content/copy";
import styles from "./Footer.module.css";

export function Footer() {
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
      <p className={`signature ${styles.names}`}>
        <span className="sr-only">
          {DISPLAY_NAMES.bride} &amp; {DISPLAY_NAMES.groom}
        </span>
        <span aria-hidden="true">
          {INITIALS.bride} &amp; {INITIALS.groom}
        </span>
      </p>


    </footer>
  );
}
