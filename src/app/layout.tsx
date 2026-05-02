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
  description: "Festival Tari Tradisional Nasional ke-5 oleh ISI Yogyakarta",
  authors: [{ name: "FTRN ISI Yogyakarta" }],
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2330D158' rx='20' width='100' height='100'/><text x='50' y='68' text-anchor='middle' fill='black' font-size='45' font-weight='bold'>F5</text></svg>" },
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
        <Toaster richColors position="top-center" toastOptions={{
          style: { background: '#1c1c1e', border: '0.5px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '14px' }
        }} />
      </body>
    </html>
  );
}
