/**
 * Scarlett Mackenzie ships its long wavy tails as alternate glyphs in the
 * Private Use Area rather than as an OpenType feature that could target only
 * the first and last letter. `swash` swaps them in by hand: an entry tail on
 * the first letter, an exit tail on the last.
 *
 * The result is visual only — PUA code points read as nonsense to screen
 * readers and search — so render it `aria-hidden` next to the plain text.
 */

/* stylistic set 3: a long wave leading into the letter */
const ENTRY: Record<string, string> = {
  a: "",
  s: "",
  v: "",
};

/* stylistic set 4: a long wave trailing out of the letter */
const EXIT: Record<string, string> = {
  d: "",
  e: "",
};

/** Lower-cases `text` (the tails are cut for the lower-case letters only) and
    gives it a swash at each end where the font has one. `à` has no tailed
    cut, so "và" only gets its entry tail. */
export function swash(text: string) {
  const chars = [...text.toLowerCase()];
  const last = chars.length - 1;
  if (last < 0) return "";
  chars[0] = ENTRY[chars[0]] ?? chars[0];
  chars[last] = EXIT[chars[last]] ?? chars[last];
  return chars.join("");
}
