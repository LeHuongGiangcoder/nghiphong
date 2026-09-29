import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Alex_Brush } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { GuestProvider } from "@/components/GuestProvider";

const quickSignature = localFont({
  src: "./fonts/quick-signature.woff2",
  variable: "--font-quick-signature",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["Snell Roundhand", "cursive"],
  adjustFontFallback: false,
});

/* Every script heading on the page. Quick Signature has no Vietnamese glyphs —
   it is missing ơ, ư and the whole U+1EA0–1EF9 block, so a Vietnamese heading
   set in it drops letters into a serif fallback mid-word; this face ships a
   full `vietnamese` subset and sets both languages.

   Alex Brush, not the Great Vibes that used to sit here: Great Vibes is upright
   formal copperplate, and next to the loose signature hand the hero is set in
   it read as a different, stiffer voice. This is a flowing brush script with
   looser joins and a lighter stroke — the same hand as the hero, which is what
   the couple asked for. It ships one weight, and `.script` must stay at 400;
   at 500 the browser synthesises a bold and thickens the whole letterform,
   which is what made these headings look heavy. */
const alexBrush = Alex_Brush({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-alex-brush",
  display: "swap",
  fallback: ["Snell Roundhand", "cursive"],
  adjustFontFallback: false,
});

/* The hero's "and" and "Save the Date". Scarlett Mackenzie covers à, so the
   Vietnamese "và" sets in the same face; it has no ơ / ư, so keep it to those
   two strings. */
const scarlett = localFont({
  src: "./fonts/scarlett-mackenzie.woff2",
  variable: "--font-scarlett",
  /* the swash tails are Private Use glyphs — a fallback face would draw them
     as empty boxes, so hold the text back until this font is in */
  display: "block",
  weight: "400",
  style: "normal",
  fallback: ["Snell Roundhand", "cursive"],
  adjustFontFallback: false,
});

/* The couple's names, and only those. CE Season Serif is the Vietnamese cut of
   the same family — it carries the stacked accents (ô, ỹ, ễ) the trial Season
   Serif below is missing, which is what lets the names be set in full. */
const ceSeason = localFont({
  src: "./fonts/ce-season-serif.woff2",
  variable: "--font-ce-season",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["Times New Roman", "serif"],
});

const season = localFont({
  src: [
    { path: "./fonts/season-serif-light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/season-serif-light-italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/season-serif-regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/season-serif-medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-season",
  display: "swap",
  fallback: ["Times New Roman", "serif"],
});

/* Body copy. Cormorant Garamond ships both axes as one variable file per
   style, so the whole 300–700 range comes down in two requests and every
   Vietnamese diacritic is covered by the same face as the Latin text. */
const cormorant = localFont({
  src: [
    {
      path: "./fonts/cormorant-garamond.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "./fonts/cormorant-garamond-italic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Garamond", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: "Ngô Mỹ Nghi & Nguyễn Thanh Phong — 13.12.2026",
  description:
    "Ngô Mỹ Nghi & Nguyễn Thanh Phong invite you to celebrate their wedding on 13 December 2026 at Hotel Nikko Saigon.",
  icons: {
    icon: "/component/19.png", // Chosen from public/component as the browser logo
  },
  openGraph: {
    title: "Ngô Mỹ Nghi & Nguyễn Thanh Phong — 13.12.2026",
    description: "Join us at Hotel Nikko Saigon on 13 December 2026.",
    type: "website",
    images: [], // Temporarily leave preview image empty
  },
  twitter: {
    card: "summary_large_image",
    title: "Ngô Mỹ Nghi & Nguyễn Thanh Phong — 13.12.2026",
    description: "Join us at Hotel Nikko Saigon on 13 December 2026.",
    images: [], // Temporarily leave preview image empty
  },
};

export const viewport: Viewport = {
  themeColor: "#f9f4ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${quickSignature.variable} ${alexBrush.variable} ${scarlett.variable} ${ceSeason.variable} ${season.variable} ${cormorant.variable}`}>
      <body>
        <LanguageProvider>
          <GuestProvider>{children}</GuestProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
