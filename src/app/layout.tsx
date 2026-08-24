import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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

const season = localFont({
  src: [
    { path: "./fonts/season-serif-light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/season-serif-light-italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/season-serif-regular.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-season",
  display: "swap",
  fallback: ["Times New Roman", "serif"],
});

const notoSerif = localFont({
  src: [
    { path: "./fonts/noto-serif-display.woff2", weight: "300 700", style: "normal" },
    {
      path: "./fonts/noto-serif-display-italic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-noto-serif",
  display: "swap",
  fallback: ["Times New Roman", "serif"],
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
    <html lang="en" className={`${quickSignature.variable} ${season.variable} ${notoSerif.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
