"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

/** The most lines the guest's name may take before it is scaled down. */
const DEFAULT_MAX_LINES = 2;
/** How far the name may be scaled down before it stops — below this it would
    be too small to sit under the greeting as part of the same phrase. */
const DEFAULT_MIN_SCALE = 0.62;
/** The step the scale comes down in while the name is being fitted. */
const STEP = 0.04;

type Options = {
  /** lines the name may run to before it is scaled down at all */
  maxLines?: number;
  /** floor on `--name-scale` */
  minScale?: number;
  /** lines we would rather the name took, if a small step down buys it */
  preferLines?: number;
  /** how far the name may be stepped down to reach `preferLines` */
  preferScale?: number;
  /**
   * A box the name must not push past — the cover's sheet, which is the
   * viewport and cannot scroll out of its own frame. Read at fit time rather
   * than passed in, since the element is not there on the first render.
   */
  within?: () => HTMLElement | null;
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
 * `preferLines` is the second half of it. A name is best read on one line, and
 * most names reach that on a step or two down — "Chị Quế Thuyền" at 0.8 is
 * still a full-sized heading. A guest list also carries names no step would
 * fit on one line ("Gia đình anh Hoàng Vinh & chị Diên Châu"), and shrinking
 * those until they do leaves the longest names set smallest, which is the one
 * thing this hook exists to avoid. So the one-line fit is attempted first and
 * only as far as `preferScale`; a name that cannot reach it keeps its full
 * size and takes the second line instead.
 *
 * Both the cover and the greeting set the guest's name in the same script
 * hand, at their own sizes, and both need this — so it lives here rather than
 * being written out twice.
 */
export function useFitName(
  name: string | undefined,
  {
    maxLines = DEFAULT_MAX_LINES,
    minScale = DEFAULT_MIN_SCALE,
    preferLines,
    preferScale,
    within,
  }: Options = {},
) {
  const ref = useRef<HTMLSpanElement>(null);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const setScale = (scale: number) => {
      if (scale === 1) el.style.removeProperty("--name-scale");
      else el.style.setProperty("--name-scale", String(scale));
    };

    const fitsIn = (lines: number) => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      // sub-pixel rounding: a hair over the last line is still that line
      return el.scrollHeight <= lineHeight * lines + 1;
    };

    /** Steps down from full size until the name fits `lines`, or gives up at
        `floor` — and reports the scale it stopped at and whether it fitted. */
    const stepTo = (lines: number, floor: number) => {
      let scale = 1;
      setScale(scale);
      while (!fitsIn(lines) && scale > floor) {
        scale = Math.max(floor, scale - STEP);
        setScale(scale);
      }
      return { scale, fitted: fitsIn(lines) };
    };

    /**
     * The last word, and the only one that is not about the name's own lines.
     *
     * The cover is a fixed sheet the height of the viewport, with a gold frame
     * drawn on its edges and the button placed against its foot. A name long
     * enough to need a third line can make the copy taller than the sheet, and
     * then the sheet scrolls: the title rides up out of the frame and the
     * button sits below it, which is the one failure worse than a name set a
     * size down. So once the lines are settled, the name keeps stepping down
     * until the sheet stops overflowing.
     */
    const confine = (from: number) => {
      const box = within?.();
      if (!box) return;
      const over = () => box.scrollHeight > box.clientHeight + 1;
      if (!over()) return;

      let scale = from;
      while (over() && scale > minScale) {
        scale = Math.max(minScale, scale - STEP);
        setScale(scale);
      }
      // A window too short for the copy at any size — a phone on its side, or
      // one of the longest names on a small screen. The sheet scrolls there
      // and its frame grows with it, so a name set at the floor would be
      // giving up its size for nothing. Hand it back.
      if (over()) setScale(from);
    };

    // A short step down to keep the name on one line, where that is on offer.
    if (preferLines && preferScale) {
      const one = stepTo(preferLines, preferScale);
      if (one.fitted) return confine(one.scale);
    }

    // Otherwise full size, and as many lines as it takes up to `maxLines`.
    confine(stepTo(maxLines, minScale).scale);
  }, [maxLines, minScale, preferLines, preferScale, within]);

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
