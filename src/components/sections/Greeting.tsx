"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { useGuest } from "@/components/GuestProvider";
import { useFitName } from "@/components/useFitName";
import { Reveal } from "@/components/Reveal";

import { DISPLAY_NAMES } from "@/content/copy";
import styles from "./Greeting.module.css";

export function Greeting() {
  const { t } = useLang();
  const guest = useGuest();
  // one line where a short step down buys it, two at full size otherwise —
  // the same rule the cover's address follows; see useFitName
  const nameRef = useFitName(guest?.name, {
    preferLines: 1,
    preferScale: 0.8,
    maxLines: 3,
  });

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
        <span className={styles.lace} aria-hidden="true" />

        <div className={`measure ${styles.content}`}>
          <div className={`section__head ${styles.head}`}>
            <Reveal as="p" className="eyebrow" delay={80}>
              {t.greeting.eyebrow}
            </Reveal>

            <Reveal delay={120}>
              {/* One heading, two lines: the greeting and — when the guest
                  opened their own link — their name. The name holds one fixed
                  size whatever its length and wraps when it has to. */}
              <h2 className={`script ${styles.title}`}>
                {guest ? t.greeting.titleGuest : t.greeting.title}
                {guest && (
                  <span ref={nameRef} className={styles.guestName}>
                    {guest.name}
                  </span>
                )}
              </h2>
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
            <p className={styles.signature}>
              <span className="sr-only">
                {DISPLAY_NAMES.bride} &amp; {DISPLAY_NAMES.groom}
              </span>
              <span className={styles.monogram} aria-hidden="true" />
            </p>
          </Reveal>
        </div>
      </div>

    </section>
  );
}
