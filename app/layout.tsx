import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { schemaWebSite, schemaOrganization } from "@/lib/schema";
import { Providers } from "@/app/providers";
import Script from "next/script";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800"],
  variable: "--font-plus-jakarta",
});

// ─── Root Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://barza.app"),

  title: {
    default: "BARZA | A Beleza é Presença",
    template: "%s | Barza",
  },
  description:
    "Barza junta comunidade, serviços e produtos numa só plataforma. Descobre tendências, marca profissionais e compra com confiança.",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  openGraph: {
    siteName: "Barza",
    type: "website",
    locale: "pt_AO",
    url: "https://barza.app",
    title: "BARZA | A Beleza é Presença",
    description:
      "Barza junta comunidade, serviços e produtos numa só plataforma. Descobre tendências, marca profissionais e compra com confiança.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Barza — A Beleza é Presença",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@barzaapp",
    title: "BARZA | A Beleza é Presença",
    description: "Barza junta comunidade, serviços e produtos numa só plataforma.",
    images: ["/og-default.jpg"],
  },

  icons: {
    icon: [{ url: "/barza_logo.png", type: "image/png" }],
    apple: [{ url: "/barza_logo.png", type: "image/png" }],
    shortcut: "/barza_logo.png",
  },

  verification: {
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN",
  },
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* ── Global JSON-LD: WebSite (SiteLinksSearchBox) ── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebSite()) }} />
        {/* ── Global JSON-LD: Organization ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaOrganization()),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakarta.variable} bg-surface-container-lowest selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden`}
      >
        <Providers>
          {children}
        </Providers>

        {/* ── Google Analytics 4 ── */}

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-SWSLCSEPWQ" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SWSLCSEPWQ', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
