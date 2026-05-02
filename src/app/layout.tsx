import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FTRN #5 - Festival Tari Tradisional Nasional",
  description: "Festival Tari Tradisional Nasional ke-5 oleh ISI Yogyakarta. Rayakan kekayaan budaya tari tradisional Indonesia.",
  keywords: ["FTRN", "Festival Tari", "Tradisional", "ISI Yogyakarta", "Budaya Indonesia", "Tari Nusantara"],
  authors: [{ name: "FTRN ISI Yogyakarta" }],
  openGraph: {
    title: "FTRN #5 - Festival Tari Tradisional Nasional",
    description: "Festival Tari Tradisional Nasional ke-5 oleh ISI Yogyakarta",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
