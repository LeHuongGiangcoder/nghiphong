"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { MAPS_URL } from "@/content/copy";
import { downloadIcs } from "@/lib/calendar";
import styles from "./Agenda.module.css";

export function Agenda() {
  const { t } = useLang();

  return (
    <section className={`section ${styles.agenda}`} id="agenda">
      <div className="section-bg">
        <Image
          src="/decor/panel-section.webp"
          alt=""
          fill
          sizes="(max-width: 40rem) 100vw, 40rem"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={`decor ${styles.pampas}`} aria-hidden="true">
        <Image src="/decor/pampas.webp" alt="" width={700} height={1296} />
      </div>

      <div className="container stack">
        <Reveal className="center stack stack--md">
          <p className="eyebrow">{t.agenda.eyebrow}</p>
          <h2 className={`script ${styles.title}`}>{t.agenda.title}</h2>
          <p className={`num ${styles.dateFull}`}>{t.agenda.dateFull}</p>
          <Image
            className="divider"
            src="/decor/flourish-gold.webp"
            alt=""
            width={700}
            height={595}
            style={{ width: "6rem" }}
          />
        </Reveal>

        <ol className={styles.timeline}>
          {t.agenda.items.map((item, i) => (
            <Reveal as="li" key={item.time} className={styles.item} delay={i * 90}>
              <div className={styles.marker} aria-hidden="true">
                <Image src="/decor/pearl.webp" alt="" width={800} height={772} />
              </div>
              <p className={`num ${styles.time}`}>{item.time}</p>
              <h3 className={`h3 ${styles.itemTitle}`}>{item.title}</h3>
              <p className={`small ${styles.note}`}>{item.note}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <div className={`card center stack stack--md ${styles.venue}`}>
            <p className="eyebrow">{t.agenda.venueTitle}</p>
            <div>
              <h3 className={`h2 ${styles.venueName}`}>{t.agenda.venueName}</h3>
              <p className="small">{t.agenda.venueAddress}</p>
            </div>
            <div className={`cluster ${styles.actions}`}>
              <a
                className="btn btn--primary btn--sm"
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.agenda.mapCta}
              </a>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() =>
                  downloadIcs({
                    title: t.agenda.calendarTitle,
                    location: `${t.agenda.venueName}, ${t.agenda.venueAddress}`,
                  })
                }
              >
                {t.agenda.calendarCta}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
