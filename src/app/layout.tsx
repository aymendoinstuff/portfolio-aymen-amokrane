// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aymen Portfolio — We Doing",
  description: "Black & White Halftone portfolio site",
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
        {/* Shared halftone background overlay (keep only in root) */}
        <div className="pointer-events-none fixed inset-0 opacity-[0.03] bg-[linear-gradient(transparent_23px,_#000_24px),linear-gradient(90deg,transparent_23px,_#000_24px)] bg-[size:24px_24px]" />
      </body>
    </html>
  );
}
