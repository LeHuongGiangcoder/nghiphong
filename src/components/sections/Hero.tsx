"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { Countdown } from "@/components/Countdown";
import { Reveal } from "@/components/Reveal";
import { DISPLAY_NAMES } from "@/content/copy";
import styles from "./Hero.module.css";

export function Hero() {
  const { t } = useLang();

  return (
    <section className={`section ${styles.hero}`} id="hero">
      <div className="section-bg">
        <Image
          src="/decor/panel-hero.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 40rem) 100vw, 40rem"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={`decor ${styles.pampas}`} aria-hidden="true">
        <Image src="/decor/pampas.webp" alt="" width={700} height={1296} />
      </div>

      <div className={`container ${styles.content}`}>
        <Reveal as="p" className="eyebrow" delay={100}>
          {t.hero.eyebrow}
        </Reveal>

        <Reveal delay={220}>
          <h1 className={styles.names}>
            <span className="display script--latin">{DISPLAY_NAMES.bride}</span>
            <span className={`script script--latin ${styles.amp}`} aria-hidden="true">
              &amp;
            </span>
            <span className="sr-only"> {t.hero.and} </span>
            <span className="display script--latin">{DISPLAY_NAMES.groom}</span>
          </h1>
        </Reveal>

        <Reveal delay={340}>
          <p className={styles.invite}>{t.hero.invite}</p>
        </Reveal>

        <Reveal delay={420}>
          <Image
            className="divider"
            src="/decor/rule-gold.webp"
            alt=""
            width={900}
            height={159}
          />
        </Reveal>

        <Reveal delay={500}>
          <p className={`num ${styles.date}`}>{t.hero.dateLine}</p>
          <p className={`caption ${styles.dateMeta}`}>
            {t.hero.dayLine} &middot; {t.hero.venueShort}
          </p>
        </Reveal>

        <Reveal delay={600}>
          <Countdown />
        </Reveal>

        <Reveal delay={700}>
          <a href="#rsvp" className="btn btn--outline">
            {t.hero.cta}
          </a>
        </Reveal>
      </div>

      <p className={styles.scroll} aria-hidden="true">
        <span>{t.hero.scroll}</span>
        <span className={styles.scrollLine} />
      </p>
    </section>
  );
}
