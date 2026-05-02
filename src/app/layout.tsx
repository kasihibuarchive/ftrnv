import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${poppins.variable} antialiased`}
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
            fontFamily: 'var(--font-poppins), sans-serif',
          }
        }} />
      </body>
    </html>
  );
}
