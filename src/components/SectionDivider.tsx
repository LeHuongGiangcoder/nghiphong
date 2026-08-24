import Image from "next/image";
import styles from "./SectionDivider.module.css";

/** Ornament that bridges two sections — see the seam rules in globals.css. */
export function SectionDivider() {
  return (
    <div className={`seam ${styles.seam}`}>
      <Image
        src="/component/section-divider.png"
        alt=""
        width={2813}
        height={2813}
      />
    </div>
  );
}
