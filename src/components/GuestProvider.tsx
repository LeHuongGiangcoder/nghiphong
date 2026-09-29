"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * The Apps Script web app URL — the `…/exec` deployment of
 * docs/apps-script/guest-management.gs.
 *
 * Committed in the clear on purpose: the couple cannot set environment
 * variables on the host, and this endpoint only maps a slug to a guest name.
 * Note what that means — anyone who has the URL can read a name by guessing a
 * slug, and can post an RSVP. That is the same exposure as the invite links
 * themselves. NEXT_PUBLIC_RSVP_ENDPOINT still overrides it when set, which is
 * how you point at a test deployment without touching this file.
 *
 * After re-deploying the Apps Script, paste the new `…/exec` URL here — see
 * docs/guest-management.md.
 */
export const RSVP_ENDPOINT =
  process.env.NEXT_PUBLIC_RSVP_ENDPOINT ??
  "https://script.google.com/macros/s/AKfycbwyHpm8BhV1N6OrslkM8gxr1J9dRxVfZZFlGy962T0AKvD6o_6sPTCCS7z0gwal1stx/exec";

export type Guest = {
  slug: string;
  name: string;
  /** true once this guest has already answered the form */
  answered: boolean;
};

const GuestContext = createContext<Guest | null>(null);

/**
 * Reads `?to=<slug>` off the URL and asks the sheet who that is.
 *
 * Every failure path lands on the same place — `guest: null`, i.e. the page a
 * guest with no personal link would see. A wedding invitation must never show
 * an error because a spreadsheet was slow, so nothing here throws or retries.
 */
export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(null);

  useEffect(() => {
    // Read the query off `window` rather than `useSearchParams`: this is a
    // client-only concern, and the hook would force the whole page under a
    // Suspense boundary and out of static rendering.
    const params = new URLSearchParams(window.location.search);
    const slug = (params.get("to") ?? params.get("slug") ?? "").trim();
    if (!slug || !RSVP_ENDPOINT) return;

    const abort = new AbortController();

    fetch(`${RSVP_ENDPOINT}?slug=${encodeURIComponent(slug)}`, {
      signal: abort.signal,
      // Apps Script answers `/exec` with a 302 to googleusercontent.com; the
      // final response is the one carrying the JSON and `Access-Control-Allow-Origin`.
      redirect: "follow",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || !data.ok || !data.name) return;
        setGuest({
          slug: String(data.slug || slug),
          name: String(data.name).trim(),
          answered: Boolean(data.answered),
        });
      })
      .catch(() => {
        // offline, endpoint down, slug unknown — fall back to the general page
      });

    return () => abort.abort();
  }, []);

  return <GuestContext.Provider value={guest}>{children}</GuestContext.Provider>;
}

/** The guest whose personal link was opened, or null for everyone else. */
export function useGuest() {
  return useContext(GuestContext);
}
