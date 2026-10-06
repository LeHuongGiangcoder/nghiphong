"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { useGuest } from "@/components/GuestProvider";
import { useFitName } from "@/components/useFitName";
import { Reveal } from "@/components/Reveal";
import { Sprig, WaveHeart } from "@/components/Flourish";
import styles from "./Cover.module.css";

/**
 * The opening page — the envelope the invitation arrives in.
 *
 * It holds the viewport on its own and says one thing: this is a wedding
 * invitation, and it is addressed to *you*. The name comes from the sheet, by
 * way of `?to=<slug>` and `GuestProvider`; on a link with no slug the greeting
 * falls back to a general form rather than leaving a gap, which is the same
 * rule the rest of the page follows.
 *
 * Everything here is the existing kit — the section background, `.decor`
 * corner sprays, `Reveal`, the `Flourish` pen lines and the type tokens. The
 * only new ink is the gold rule frame, which is drawn in CSS.
 */
export function Cover() {
  const { t } = useLang();
  const guest = useGuest();
  // One line at the cover's size; it is set larger than the greeting's, so a
  // long name steps down further before it is allowed a second line.
  const nameRef = useFitName(guest?.name, { maxLines: 2, minScale: 0.5 });

  const name = guest?.name ?? t.cover.dearFallback;

  return (
    <section className={`section ${styles.cover}`} id="cover">
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

      {/* The two corner sprays, the same art the hero uses. The left one is
          flipped onto the top corner so the florals run diagonally across the
          page the way they do on the printed card. */}
      <div className={`decor ${styles.sprayTop}`} aria-hidden="true">
        <Image
          src="/decor/hero-corner-left.webp"
          alt=""
          width={900}
          height={545}
          priority
          sizes="(max-width: 40rem) 72vw, 29rem"
        />
      </div>
      <div className={`decor ${styles.sprayBottom}`} aria-hidden="true">
        <Image
          src="/decor/hero-corner-right.webp"
          alt=""
          width={760}
          height={874}
          sizes="(max-width: 40rem) 52vw, 21rem"
        />
      </div>

      {/* The gold rule frame — a double hairline inset from the trim, with a
          second line drawn just inside it. Inert, and it sits over the panel
          art but under the copy. */}
      <span className={styles.frame} aria-hidden="true" />

      <div className={`measure ${styles.content}`}>
        <Reveal as="p" className={styles.title} delay={80}>
          <Sprig className={styles.titleSprig} />
          <span className={styles.titleText}>{t.cover.title}</span>
          <Sprig className={`${styles.titleSprig} ${styles.titleSprigDown}`} />
        </Reveal>

        <Reveal delay={200}>
          {/* One heading, two lines: the address and the name it is addressed
              to. The name is the page's only gold script, so it is where the
              eye lands. */}
          <h2 className={styles.address}>
            <span className={styles.dear}>{t.cover.dear}</span>
            <span
              ref={nameRef}
              className={`script ${styles.guestName}`}
              data-fallback={guest ? undefined : "true"}
            >
              {name},
            </span>
          </h2>
        </Reveal>

        <Reveal delay={300} className={styles.flourishRow}>
          <WaveHeart className={styles.wave} />
        </Reveal>

        <Reveal delay={380} className={styles.invite}>
          {t.cover.invite.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </Reveal>

        <Reveal delay={460} className={styles.nextWrap}>
          <Sprig className={styles.nextSprig} />
          <p className={styles.next}>
            {t.cover.next.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </Reveal>
      </div>

      {/* Where the printed card numbers its pages, this one points on down —
          the invitation is a scroll, not a stack of leaves, so a page count
          would be telling the reader something untrue. */}
      <a href="#greeting" className={styles.scroll}>
        <span className="sr-only">{t.cover.scroll}</span>
        <span className={styles.scrollRule} aria-hidden="true" />
        <span className={styles.scrollDot} aria-hidden="true" />
        <span className={styles.scrollRule} aria-hidden="true" />
      </a>
    </section>
  );
}
