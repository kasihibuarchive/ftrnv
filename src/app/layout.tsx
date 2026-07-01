import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ftrn.space-z.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FTRN #5 — Festival Teater Remaja Nusantara",
    template: "%s — FTRN #5",
  },
  description:
    "Festival Teater Remaja Nusantara ke-5 · Institut Seni Indonesia Yogyakarta · Merawat kekayaan budaya teater remaja Indonesia",
  authors: [{ name: "FTRN ISI Yogyakarta" }],
  keywords: [
    "FTRN",
    "Festival Teater Remaja Nusantara",
    "ISI Yogyakarta",
    "teater remaja",
    "seni pertunjukan",
    "budaya Indonesia",
    "festival teater",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "FTRN #5 — Festival Teater Remaja Nusantara",
    description:
      "Festival Teater Remaja Nusantara ke-5 · ISI Yogyakarta",
    type: "website",
    url: siteUrl,
    siteName: "FTRN #5",
    locale: "id_ID",
    images: [
      {
        url: "/ftrn-logo.png",
        width: 1200,
        height: 630,
        alt: "FTRN #5 — Festival Teater Remaja Nusantara",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FTRN #5 — Festival Teater Remaja Nusantara",
    description:
      "Festival Teater Remaja Nusantara ke-5 · ISI Yogyakarta",
    images: ["/ftrn-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "google-site-verification=x_YY2mf8Qo3N0aCN_qYbWWynhbqKCeQ591zor6dHm0I",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "Festival Teater Remaja Nusantara #5",
              description:
                "Festival Teater Remaja Nusantara ke-5 di Institut Seni Indonesia Yogyakarta",
              startDate: "2026-06-28",
              endDate: "2026-06-30",
              location: {
                "@type": "Place",
                name: "Institut Seni Indonesia Yogyakarta",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Jl. Parangtritis Km. 6.5",
                  addressLocality: "Yogyakarta",
                  addressCountry: "ID",
                },
              },
              organizer: {
                "@type": "Organization",
                name: "FTRN ISI Yogyakarta",
              },
            }),
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(26, 46, 26, 0.85)",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(245, 240, 232, 0.06)",
              color: "#F5F0E8",
              borderRadius: "12px",
              fontSize: "13px",
              fontFamily: "var(--font-poppins), sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
