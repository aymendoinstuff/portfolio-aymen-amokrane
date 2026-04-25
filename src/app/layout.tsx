// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://www.stuffbyaymen.com";
const SITE_NAME = "Aymen Amokrane — Brand Designer";
const SITE_DESCRIPTION =
  "Senior Brand Designer based in Dubai. Strategy-led identities, visual systems, and design that scales. Available for work.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s — Aymen Amokrane",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "brand designer", "visual identity", "branding", "logo design",
    "Dubai designer", "brand strategy", "graphic designer", "design portfolio",
  ],
  authors: [{ name: "Aymen Amokrane", url: SITE_URL }],
  creator: "Aymen Amokrane",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        {children}
      </body>
    </html>
  );
}
