"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
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
 * It is its own screen, not the first band of the invitation. Once mounted it
 * lifts out of the document flow and covers the card completely, so there is
 * nothing above the greeting to scroll back to and no seam between the two —
 * pressing the button is the only way through, and the cover is gone for good
 * once it has been.
 *
 * It renders in normal flow until it has mounted, which is what a visitor
 * without JavaScript keeps: an ordinary first section they can scroll past,
 * rather than a fixed sheet over a page they can never reach. A wedding
 * invitation fails open.
 *
 * Everything here is the existing kit — the section background, `.decor`
 * corner sprays, `Reveal`, the `Flourish` pen lines and the type tokens. The
 * only new ink is the gold rule frame, which is drawn in CSS.
 */

/** How long the cover takes to fade out — must match the CSS transition. */
const EXIT_MS = 600;

/* Whether we are past hydration, read the same way the language is: as
   external state with a server snapshot. The server says "not yet" and the
   client says "yes", so the markup matches on both sides and the cover only
   becomes a fixed sheet once there is JavaScript to dismiss it again. */
const neverChanges = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function Cover() {
  const { t } = useLang();
  const guest = useGuest();
  // The address holds to a single line: the name is read at a glance, and a
  // two-line break through a long Vietnamese name ("Chị Quế / Thuyền") splits
  // it where nobody would. It steps down further than anywhere else on the
  // page instead, which a script hand carries better than a bad break does.
  const nameRef = useFitName(guest?.name, { maxLines: 1, minScale: 0.34 });
  // Flow until mounted, then the fixed sheet — see the note above.
  const mounted = useSyncExternalStore(neverChanges, onClient, onServer);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);

  const name = guest?.name ?? t.cover.dearFallback;

  /**
   * Holds the invitation shut while the cover is up.
   *
   * `overflow: hidden` on the root stops the wheel, the touch drag and the
   * arrow keys in one go. `inert` on the invitation is the other half:
   * without it Tab still walks into the card behind the cover, moving focus
   * somewhere nobody can see.
   *
   * Both come off the moment the cover starts to leave, so the card is live
   * by the time it has finished fading. A browser restoring a scroll position
   * from a back-navigation would otherwise leave the card parked halfway
   * down, hence the scroll to the top first.
   */
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const gated = document.getElementById("invitation");

    const release = () => {
      root.removeAttribute("data-cover");
      gated?.removeAttribute("inert");
    };

    if (closing) {
      release();
      return;
    }

    window.scrollTo(0, 0);
    root.setAttribute("data-cover", "closed");
    gated?.setAttribute("inert", "");

    // never leave the card locked if this component goes away
    return release;
  }, [mounted, closing]);

  /**
   * Opens the invitation: the cover fades off and is dropped.
   *
   * The anchor's own jump is cancelled — with the cover out of the flow the
   * card already starts at the top of the page, so there is nowhere to jump
   * to. Without JavaScript none of this runs and the anchor does its plain
   * job instead.
   */
  const open = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setClosing(true);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      setGone(true);
      // The button it was on is about to be dropped; hand focus to the card so
      // the next Tab continues from there rather than from the top of nowhere.
      const greeting = document.getElementById("greeting");
      greeting?.setAttribute("tabindex", "-1");
      greeting?.focus({ preventScroll: true });
    }, still ? 0 : EXIT_MS);
  }, []);

  if (gone) return null;

  return (
    <section
      className={`section ${styles.cover}`}
      id="cover"
      data-fixed={mounted || undefined}
      data-closing={closing || undefined}
    >
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
          /* This band is the first screen now, so both sprays are above the
             fold — and this one measures as the largest paint. Without the
             priority it is fetched lazily and becomes the page's LCP. */
          priority
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

      {/* Where the printed card numbers its pages, this one opens it. The
          invitation is a scroll, not a stack of leaves, so a page count would
          be telling the reader something untrue — and a cue they have to work
          out is worse than a door they can push. */}
      <a href="#greeting" className={styles.enter} onClick={open}>
        {t.cover.enter}
        <svg
          className={styles.enterChevron}
          viewBox="0 0 16 10"
          role="presentation"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1.5 1.5 8 8l6.5-6.5" />
        </svg>
      </a>
    </section>
  );
}
