"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { DISPLAY_NAMES, INITIALS } from "@/content/copy";
import styles from "./Greeting.module.css";

export function Greeting() {
  const { t } = useLang();

  return (
    <section className={`section ${styles.greeting}`} id="greeting">
      <div className="section-bg">
        <Image
          src="/decor/panel-hero.webp"
          alt=""
          fill
          sizes="(max-width: 40rem) 100vw, 40rem"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={styles.frameWrap}>
        <Image
          className={styles.frame}
          src="/decor/lace-frame.webp"
          alt=""
          width={900}
          height={1286}
          aria-hidden="true"
        />

        <div className={`measure ${styles.content}`}>
          <div className={`section__head ${styles.head}`}>
            <Reveal as="p" className="eyebrow">
              {t.greeting.eyebrow}
            </Reveal>

            <Reveal delay={120}>
              <h2 className={`script ${styles.title}`}>{t.greeting.title}</h2>
            </Reveal>
          </div>

          <Reveal className={`section__body ${styles.note}`} delay={220}>
            {t.greeting.body.map((paragraph, i) => (
              <p className="body" key={i}>
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={320}>
            <p className={`caption ${styles.signoff}`}>{t.greeting.signoff}</p>
            <p className={`signature ${styles.signature}`}>
              <span className="sr-only">
                {DISPLAY_NAMES.bride} &amp; {DISPLAY_NAMES.groom}
              </span>
              <span aria-hidden="true">
                {INITIALS.bride} &amp; {INITIALS.groom}
              </span>
            </p>
          </Reveal>
        </div>
      </div>

    </section>
  );
}
