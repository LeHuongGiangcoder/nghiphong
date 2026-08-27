import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Great_Vibes, Lato } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

const quickSignature = localFont({
  src: "./fonts/quick-signature.woff2",
  variable: "--font-quick-signature",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["Snell Roundhand", "cursive"],
  adjustFontFallback: false,
});

/* Quick Signature has no Vietnamese glyphs — it is missing ơ, ư and the whole
   U+1EA0–1EF9 block, so a Vietnamese heading set in it drops letters into a
   serif fallback mid-word. Great Vibes is the same kind of formal signature
   script and ships a full `vietnamese` subset, so it stands in for the script
   face whenever the page language is Vietnamese. */
const greatVibes = Great_Vibes({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
  fallback: ["Snell Roundhand", "cursive"],
  adjustFontFallback: false,
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

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ngo My Nghi & Nguyen Thanh Phong — 13.12.2026",
  description:
    "Ngô Mỹ Nghi Nghi & Nguyễn Thanh Phong invite you to celebrate their wedding on 13 December 2026 at Hotel Nikko Saigon.",
  icons: {
    icon: "/component/19.png", // Chosen from public/component as the browser logo
  },
  openGraph: {
    title: "Ngo My Nghi & Nguyen Thanh Phong — 13.12.2026",
    description: "Join us at Hotel Nikko Saigon on 13 December 2026.",
    type: "website",
    images: [], // Temporarily leave preview image empty
  },
  twitter: {
    card: "summary_large_image",
    title: "Ngo My Nghi & Nguyen Thanh Phong — 13.12.2026",
    description: "Join us at Hotel Nikko Saigon on 13 December 2026.",
    images: [], // Temporarily leave preview image empty
  },
};

export const viewport: Viewport = {
  themeColor: "#f9f4ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${quickSignature.variable} ${greatVibes.variable} ${season.variable} ${lato.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
