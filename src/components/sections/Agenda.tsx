"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { Timeline } from "@/components/Timeline";
import { DateThread } from "@/components/DateThread";
import { MAPS_URL } from "@/content/copy";
import { downloadIcs } from "@/lib/calendar";
import styles from "./Agenda.module.css";

export function Agenda() {
  const { t } = useLang();

  return (
    <section className={`section ${styles.agenda}`} id="agenda">
      <div className="section-bg">
        <Image
          src="/decor/panel-hero.webp"
          alt=""
          fill
          sizes="(max-width: 40rem) 100vw, 40rem"
          style={{ objectFit: "cover" }}
        />
      </div>


      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">{t.agenda.eyebrow}</p>
          <h2 className={`script ${styles.title}`}>{t.agenda.title}</h2>
          <p className={`num ${styles.dateFull}`}>{t.agenda.dateFull}</p>
        </Reveal>

        <div className="section__body">
          <div>
            {/* fade only — a lift would pull the line off the timeline's start */}
            <Reveal className="reveal--fade">
              <DateThread month={t.agenda.month} weekdays={t.agenda.weekdays} />
            </Reveal>
            <Timeline items={t.agenda.items} />
          </div>

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
      </div>
    </section>
  );
}
