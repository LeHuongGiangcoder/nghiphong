"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { Countdown } from "@/components/Countdown";
import { Reveal } from "@/components/Reveal";
import { WaveHeart } from "@/components/Flourish";
import { Vanilla } from "@/components/Vanilla";
import { DISPLAY_NAMES } from "@/content/copy";
import styles from "./Hero.module.css";

export function Hero() {
  const { t } = useLang();

  return (
    <section className={`section section--hero ${styles.hero}`} id="hero">
      <div className="section-bg">
        <Image
          src="/decor/panel-hero-17.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 40rem) 100vw, 40rem"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={`container ${styles.content}`}>
        {/* the vanilla motif flanked by the two flourish tails */}
        <div className={styles.crest} aria-hidden="true">
          <Image
            className={styles.crestWing}
            src="/decor/flourish-left.webp"
            alt=""
            width={900}
            height={123}
          />
          <Vanilla className={styles.crestFigure} />
          <Image
            className={styles.crestWing}
            src="/decor/flourish-right.webp"
            alt=""
            width={900}
            height={127}
          />
        </div>

        <Reveal as="p" className="eyebrow" delay={100}>
          {t.hero.eyebrow}
        </Reveal>

        <Reveal delay={200}>
          <h1 className={styles.names}>
            <span className="display script--latin">{DISPLAY_NAMES.bride}</span>
            <span className={styles.amp}> {t.hero.and} </span>
            <span className="display script--latin">{DISPLAY_NAMES.groom}</span>
          </h1>
        </Reveal>

        <Reveal delay={300} className={styles.saveTheDateRow}>
          <p className={styles.saveTheDate}>{t.hero.saveTheDate}</p>
        </Reveal>

        <Reveal delay={400}>
          <p className={`num script--latin ${styles.date}`}>{t.hero.dateLine}</p>
          <p className={`num ${styles.dateMeta}`}>
            {t.hero.dayLine} &middot; {t.hero.venueShort}
          </p>
        </Reveal>

        <Reveal delay={480}>
          <WaveHeart className={styles.wave} />
        </Reveal>

        <Reveal delay={560}>
          <p className={styles.invite}>{t.hero.invite}</p>
        </Reveal>

        <Reveal delay={640}>
          <Countdown />
        </Reveal>

        <Reveal delay={720}>
          <a href="#rsvp" className="btn btn--outline">
            {t.hero.cta}
          </a>
        </Reveal>

      </div>
    </section>
  );
}
