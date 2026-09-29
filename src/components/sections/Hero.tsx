"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { Countdown } from "@/components/Countdown";
import { Reveal } from "@/components/Reveal";
import { WaveHeart } from "@/components/Flourish";
import { DISPLAY_NAMES } from "@/content/copy";
import { swash } from "@/lib/swash";
import styles from "./Hero.module.css";

export function Hero() {
  const { t } = useLang();

  return (
    <section className={`section section--hero ${styles.hero}`} id="hero">
      <div className="section-bg">
        <Image
          src="/decor/panel-hero-updated.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 40rem) 100vw, 40rem"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* The two corner sprays. They sit after the background so they paint
          over it, and both are `.decor` — behind the content, inert. */}
      <div className={`decor ${styles.cornerLeft}`} aria-hidden="true">
        <Image
          src="/decor/hero-corner-left.webp"
          alt=""
          width={900}
          height={545}
          sizes="(max-width: 40rem) 58vw, 23rem"
        />
      </div>
      <div className={`decor ${styles.cornerRight}`} aria-hidden="true">
        <Image
          src="/decor/hero-corner-right.webp"
          alt=""
          width={760}
          height={874}
          sizes="(max-width: 40rem) 40vw, 16rem"
        />
      </div>

      <div className={`container ${styles.content}`}>
        {/* the flower-and-ribbon crest that opens the band */}
        <div className={styles.crest} aria-hidden="true">
          <Image
            src="/decor/hero-crest.webp"
            alt=""
            width={1280}
            height={381}
            priority
            sizes="(max-width: 40rem) 92vw, 34rem"
          />
        </div>

        <Reveal as="p" className="eyebrow" delay={100}>
          {t.hero.eyebrow}
        </Reveal>

        <Reveal delay={200}>
          <h1 className={styles.names}>
            <span className="display script--latin">{DISPLAY_NAMES.bride}</span>
            <span className={styles.amp} aria-hidden="true">
              {swash(t.hero.and)}
            </span>
            <span className="sr-only"> {t.hero.and} </span>
            <span className="display script--latin">{DISPLAY_NAMES.groom}</span>
          </h1>
        </Reveal>

        <Reveal delay={300} className={styles.saveTheDateRow}>
          <p className={styles.saveTheDate}>
            <span aria-hidden="true">{swash(t.hero.saveTheDate)}</span>
            <span className="sr-only">{t.hero.saveTheDate}</span>
          </p>
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
