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
  title: "FTRN #5 — Festival Tari Tradisional Nasional",
  description: "Festival Tari Tradisional Nasional ke-5 · ISI Yogyakarta",
  authors: [{ name: "FTRN ISI Yogyakarta" }],
  openGraph: {
    title: "FTRN #5 — Festival Tari Tradisional Nasional",
    description: "Festival Tari Tradisional Nasional ke-5 · ISI Yogyakarta",
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
        <Toaster richColors position="top-center" toastOptions={{
          style: {
            background: 'rgba(26, 46, 26, 0.85)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(245, 240, 232, 0.06)',
            color: '#F5F0E8',
            borderRadius: '12px',
            fontSize: '13px',
            letterSpacing: '0.02em',
          }
        }} />
      </body>
    </html>
  );
}
