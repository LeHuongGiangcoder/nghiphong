"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { WaveHeart } from "@/components/Flourish";
import styles from "./Rsvp.module.css";

type Attending = "yes" | "no";

/**
 * The shape that will be POSTed once a backend exists. Keeping it named and
 * in one place means wiring up Sheets / n8n later is a single call site.
 */
export type RsvpPayload = {
  name: string;
  attending: Attending;
  meal: string | null;
  wishes: string;
  lang: string;
  submittedAt: string;
};

export function Rsvp() {
  const { t, lang } = useLang();
  const uid = useId();

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<Attending | null>(null);
  const [meal, setMeal] = useState<number>(0);
  const [wishes, setWishes] = useState("");
  const [errors, setErrors] = useState<{ name?: boolean; attending?: boolean }>({});
  const [sent, setSent] = useState<Attending | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next = { name: name.trim().length === 0, attending: attending === null };
    setErrors(next);
    if (next.name || next.attending) return;

    const payload: RsvpPayload = {
      name: name.trim(),
      attending: attending as Attending,
      meal: attending === "yes" ? t.rsvp.meals[meal] : null,
      wishes: wishes.trim(),
      lang,
      submittedAt: new Date().toISOString(),
    };

    // TODO: replace with the real endpoint — `await fetch("/api/rsvp", …)`.
    console.info("RSVP", payload);
    setSent(payload.attending);
  }

  function reset() {
    setName("");
    setAttending(null);
    setMeal(0);
    setWishes("");
    setErrors({});
    setSent(null);
  }

  return (
    <section className={`section ${styles.rsvp}`} id="rsvp">
      <div className="section-bg">
        <Image
          src="/decor/panel-section.webp"
          alt=""
          fill
          sizes="(max-width: 40rem) 100vw, 40rem"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="container">
        {/* — dress code ——————————————————————————— */}
        <Reveal className="section__head">
          <Image
            className={styles.flower}
            src="/decor/vanilla.webp"
            alt=""
            width={900}
            height={803}
          />
          <p className="eyebrow">{t.dress.eyebrow}</p>
          <h2 className={`script script--latin ${styles.dressTitle}`}>{t.dress.title}</h2>
          <div className={`measure ${styles.dressBody}`}>
            <p className="body">{t.dress.body}</p>
            <ul className={styles.swatches} aria-hidden="true">
              {["#f3d9d6", "#f6ecd2", "#dfe7d8", "#d8e3ec", "#e2dae9"].map((c) => (
                <li key={c} style={{ background: c }} />
              ))}
            </ul>
            <p className="caption">{t.dress.yes}</p>
            <p className={`caption ${styles.avoid}`}>{t.dress.no}</p>
          </div>
          <WaveHeart className={styles.wave} />
        </Reveal>

        {/* — form ————————————————————————————————— */}
        <Reveal className="section__head">
          <p className="eyebrow">{t.rsvp.eyebrow}</p>
          <h2 className={`h1 ${styles.formTitle}`}>{t.rsvp.title}</h2>
          <div className={`measure ${styles.formIntro}`}>
            <p className="lead">{t.rsvp.intro}</p>
            <p className="caption">{t.rsvp.deadline}</p>
          </div>
        </Reveal>

        <Reveal className="section__body">
          {sent ? (
            <div className={`card center stack stack--md ${styles.thanks}`}>
              <Image
                className={styles.seal}
                src="/decor/vanilla.webp"
                alt=""
                width={900}
                height={803}
              />
              <h3 className={`script ${styles.thanksTitle}`}>
                {sent === "yes" ? t.rsvp.thanksYesTitle : t.rsvp.thanksNoTitle}
              </h3>
              <p className="body">
                {sent === "yes" ? t.rsvp.thanksYesBody : t.rsvp.thanksNoBody}
              </p>
              <button type="button" className="btn btn--ghost btn--sm" onClick={reset}>
                {t.rsvp.again}
              </button>
            </div>
          ) : (
            <form className={`card stack ${styles.form}`} onSubmit={handleSubmit} noValidate>
              <div className="field" data-invalid={errors.name || undefined}>
                <label className="label" htmlFor={`${uid}-name`}>
                  {t.rsvp.name}
                </label>
                <input
                  id={`${uid}-name`}
                  className="input"
                  type="text"
                  autoComplete="name"
                  placeholder={t.rsvp.namePlaceholder}
                  value={name}
                  aria-invalid={errors.name || undefined}
                  aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: false }));
                  }}
                />
                {errors.name && (
                  <p className="error" id={`${uid}-name-err`}>
                    {t.rsvp.nameError}
                  </p>
                )}
              </div>

              <fieldset className="field" data-invalid={errors.attending || undefined}>
                <legend className="label">{t.rsvp.attending}</legend>
                <div className="choices choices--stack">
                  {(
                    [
                      ["yes", t.rsvp.yes],
                      ["no", t.rsvp.no],
                    ] as const
                  ).map(([value, label]) => (
                    <label className="choice" key={value} htmlFor={`${uid}-att-${value}`}>
                      <input
                        id={`${uid}-att-${value}`}
                        type="radio"
                        name={`${uid}-attending`}
                        value={value}
                        checked={attending === value}
                        onChange={() => {
                          setAttending(value);
                          setErrors((p) => ({ ...p, attending: false }));
                        }}
                      />
                      <span className="choice__dot" aria-hidden="true" />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                {errors.attending && <p className="error">{t.rsvp.attendingError}</p>}
              </fieldset>

              {attending === "yes" && (
                <fieldset className="field">
                  <legend className="label">{t.rsvp.meal}</legend>
                  <div className="choices">
                    {t.rsvp.meals.map((label, i) => (
                      <label className="choice" key={label} htmlFor={`${uid}-meal-${i}`}>
                        <input
                          id={`${uid}-meal-${i}`}
                          type="radio"
                          name={`${uid}-meal`}
                          value={label}
                          checked={meal === i}
                          onChange={() => setMeal(i)}
                        />
                        <span className="choice__dot" aria-hidden="true" />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="hint">{t.rsvp.mealHint}</p>
                </fieldset>
              )}

              <div className="field">
                <label className="label" htmlFor={`${uid}-wishes`}>
                  {t.rsvp.wishes}
                </label>
                <textarea
                  id={`${uid}-wishes`}
                  className="textarea"
                  rows={4}
                  placeholder={t.rsvp.wishesPlaceholder}
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn--primary btn--block btn--lg">
                {t.rsvp.submit}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
