import Image from "next/image";
import styles from "./Vanilla.module.css";

/**
 * The vanilla flower — the site's single decorative motif.
 *
 * Every appearance renders at exactly one size (--vanilla-size) and one ink
 * level (--vanilla-ink), both defined in globals.css. Callers position it;
 * they never resize or re-tint it, so the motif reads as the *same* object
 * each time it returns.
 */
export function Vanilla({ className }: { className?: string }) {
  return (
    <Image
      className={`${styles.vanilla}${className ? ` ${className}` : ""}`}
      src="/decor/vanilla.webp"
      alt=""
      width={900}
      height={803}
    />
  );
}
