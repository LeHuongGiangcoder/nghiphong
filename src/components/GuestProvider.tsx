"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

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

/** Where a resolved name is kept, keyed by slug. */
const CACHE_PREFIX = "np-guest:";

/**
 * How long the greeting stays blank waiting for the sheet.
 *
 * Past this the general greeting is shown — a slow spreadsheet must not leave
 * a guest looking at a gap for ever. Generous on purpose: the sheet usually
 * answers in a second or two, and showing the wrong greeting is worse than
 * showing none for a moment longer.
 */
const RESOLVE_TIMEOUT_MS = 6000;

/** `?to=` / `?slug=` off the current URL — the inline script reads the same two. */
function readSlug() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("to") ?? params.get("slug") ?? "").trim();
}

/**
 * Marks the document as "a name is on its way", before the first paint.
 *
 * The page is statically rendered, so the HTML that paints before React has
 * even hydrated already carries the general greeting. Nothing React does can
 * stop that paint — which is why, for the second or two the sheet takes, a
 * personal link used to flash "Our treasured guest" first. So the decision is
 * made in the document itself: if the URL carries a slug, this turns the
 * `data-guest="ready"` the layout renders into `data-guest="pending"` while
 * the document is still parsing, and the CSS holds the greeting back until
 * `GuestProvider` puts it back to "ready".
 *
 * It settles the attribute itself after a while too. The provider's own
 * timeout normally gets there first; this one covers the case where the React
 * bundle never arrives, so a blocked script can't hide the greeting for good.
 */
export const GUEST_PENDING_SCRIPT = `try{
var p=new URLSearchParams(location.search),s=(p.get('to')||p.get('slug')||'').trim(),r=document.documentElement;
if(s){r.setAttribute('data-guest','pending');setTimeout(function(){r.setAttribute('data-guest','ready')},${RESOLVE_TIMEOUT_MS + 2000})}
}catch(e){}`;

/* --------------------------------------------------------------------------
 * The guest is external state too — it starts life in localStorage, the same
 * as the chosen language, and is read the same way: the server and the
 * hydrating client both start from "nobody", then React re-renders once with
 * whatever this browser already knows. Remembering the name is what makes a
 * second visit to the same link instant instead of another round trip.
 * -------------------------------------------------------------------------- */

/** undefined until the cache has been looked at; null once it came up empty. */
let snapshot: Guest | null | undefined;
const listeners = new Set<() => void>();

function readSnapshot(): Guest | null {
  if (snapshot === undefined) {
    const slug = readSlug();
    snapshot = slug ? readCache(slug) : null;
  }
  return snapshot;
}

function serverSnapshot(): Guest | null {
  return null;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function publish(next: Guest) {
  snapshot = next;
  writeCache(next.slug, next);
  listeners.forEach((l) => l());
}

function readCache(slug: string): Guest | null {
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + slug);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.name !== "string" || !data.name) return null;
    return { slug, name: data.name, answered: Boolean(data.answered) };
  } catch {
    // no storage, or something else wrote nonsense there — ask the sheet
    return null;
  }
}

function writeCache(slug: string, guest: Guest) {
  try {
    window.localStorage.setItem(
      CACHE_PREFIX + slug,
      JSON.stringify({ name: guest.name, answered: guest.answered }),
    );
  } catch {
    // private mode / storage full — the name simply will not be remembered
  }
}

/* -------------------------------------------------------------------------- */

const GuestContext = createContext<Guest | null>(null);

/**
 * Reads `?to=<slug>` off the URL and asks the sheet who that is.
 *
 * Every failure path lands on the same place — `guest: null`, i.e. the page a
 * guest with no personal link would see. A wedding invitation must never show
 * an error because a spreadsheet was slow, so nothing here throws or retries.
 */
export function GuestProvider({ children }: { children: React.ReactNode }) {
  const guest = useSyncExternalStore(subscribe, readSnapshot, serverSnapshot);

  useEffect(() => {
    const root = document.documentElement;
    let cancelled = false;
    /** Lets the greeting show, whatever we ended up with. */
    const settle = () => {
      if (!cancelled) root.setAttribute("data-guest", "ready");
    };

    // Read the query off `window` rather than `useSearchParams`: this is a
    // client-only concern, and the hook would force the whole page under a
    // Suspense boundary and out of static rendering.
    const slug = readSlug();
    if (!slug || !RSVP_ENDPOINT) {
      settle();
      return;
    }

    // A name this browser has already been told is on screen by now, so there
    // is nothing to wait for; the fetch below still runs, in case the sheet
    // has since been corrected.
    if (snapshot) settle();

    const abort = new AbortController();
    const timer = window.setTimeout(settle, RESOLVE_TIMEOUT_MS);

    fetch(`${RSVP_ENDPOINT}?slug=${encodeURIComponent(slug)}`, {
      signal: abort.signal,
      // Apps Script answers `/exec` with a 302 to googleusercontent.com; the
      // final response is the one carrying the JSON and `Access-Control-Allow-Origin`.
      redirect: "follow",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || !data.ok || !data.name) return;
        publish({
          slug: String(data.slug || slug),
          name: String(data.name).trim(),
          answered: Boolean(data.answered),
        });
      })
      .catch(() => {
        // offline, endpoint down, slug unknown — fall back to the general page
      })
      .finally(() => {
        window.clearTimeout(timer);
        settle();
      });

    return () => {
      // Deliberately not settling here: in development this effect is run
      // twice, and the aborted first pass must not uncover the greeting the
      // second pass is still waiting on. The inline script's own timeout is
      // what guarantees the attribute never outlives the wait.
      cancelled = true;
      abort.abort();
      window.clearTimeout(timer);
    };
  }, []);

  return <GuestContext.Provider value={guest}>{children}</GuestContext.Provider>;
}

/** The guest whose personal link was opened, or null for everyone else. */
export function useGuest() {
  return useContext(GuestContext);
}
