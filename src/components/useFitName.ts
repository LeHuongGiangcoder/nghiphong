"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

/** The most lines the guest's name may take before it is scaled down. */
const DEFAULT_MAX_LINES = 2;
/** How far the name may be scaled down before it stops — below this it would
    be too small to sit under the greeting as part of the same phrase. */
const DEFAULT_MIN_SCALE = 0.62;

type Options = {
  /** lines the name may run to at full size */
  maxLines?: number;
  /** floor on `--name-scale` */
  minScale?: number;
};

/**
 * Holds a guest's name to `maxLines`, and hands back the ref to put on it.
 *
 * The size in the CSS is the one every name gets — a short name is never
 * shrunk to match a long one. Only when a name still wraps past `maxLines` at
 * that size does this step it down via `--name-scale`, a notch at a time,
 * until it fits. Measured rather than guessed from the character count: the
 * script faces' widths vary enough per letter that an estimate either wrapped
 * anyway or shrank names that would have fitted.
 *
 * Both the cover and the greeting set the guest's name in the same script
 * hand, at their own sizes, and both need this — so it lives here rather than
 * being written out twice.
 */
export function useFitName(
  name: string | undefined,
  { maxLines = DEFAULT_MAX_LINES, minScale = DEFAULT_MIN_SCALE }: Options = {},
) {
  const ref = useRef<HTMLSpanElement>(null);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // back to full size first, so a name that no longer needs the step-down
    // (a wider window, a shorter name) gets it back
    el.style.removeProperty("--name-scale");

    const overflows = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      // sub-pixel rounding: a hair over the last line is still that line
      return el.scrollHeight > lineHeight * maxLines + 1;
    };

    let scale = 1;
    while (overflows() && scale > minScale) {
      scale = Math.max(minScale, scale - 0.04);
      el.style.setProperty("--name-scale", String(scale));
    }
  }, [maxLines, minScale]);

  useLayoutEffect(fit, [fit, name]);

  useEffect(() => {
    window.addEventListener("resize", fit);
    // the script face is still loading on a first visit, and its metrics are
    // what the fit is measured against
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

  return ref;
}
