import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

const citadel = localFont({
  src: "./fonts/citadel-script.woff2",
  variable: "--font-citadel",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["Snell Roundhand", "cursive"],
  adjustFontFallback: false,
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
  title: "My Nghi & Thanh Phong — 13.12.2026",
  description:
    "Ngô Mỹ Nghi Nghi & Nguyễn Thanh Phong invite you to celebrate their wedding on 13 December 2026 at Hotel Nikko Saigon.",
  icons: {
    icon: "/component/19.png", // Chosen from public/component as the browser logo
  },
  openGraph: {
    title: "My Nghi & Thanh Phong — 13.12.2026",
    description: "Join us at Hotel Nikko Saigon on 13 December 2026.",
    type: "website",
    images: [], // Temporarily leave preview image empty
  },
  twitter: {
    card: "summary_large_image",
    title: "My Nghi & Thanh Phong — 13.12.2026",
    description: "Join us at Hotel Nikko Saigon on 13 December 2026.",
    images: [], // Temporarily leave preview image empty
  },
};

export const viewport: Viewport = {
  themeColor: "#f9f4ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${citadel.variable} ${notoSerif.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
