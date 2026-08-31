import type { Metadata } from "next";
import { Anton, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { abs, ORG, SITE_URL } from "@/lib/site";

/** Google tag (Ads / gtag.js). Override with NEXT_PUBLIC_GTAG_ID if it changes. */
const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID || "AW-18416026404";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Elpuo — Custom Sports Uniforms, Sublimated In-House",
    template: "%s · Elpuo",
  },
  description:
    "Custom team uniforms for 10 sports. Full sublimation, tackle twill and embroidery, player names and numbers. Choose your fabric and options, upload your design and request a quote.",
  applicationName: "Elpuo",
  alternates: { canonical: "/" },
  keywords: [
    "custom sports uniforms",
    "custom team uniforms",
    "sublimated jerseys",
    "team kit builder",
    "custom soccer jerseys",
    "custom football jerseys",
    "custom basketball uniforms",
    "custom rugby jerseys",
  ],
  openGraph: {
    title: "Elpuo — Custom Sports Uniforms",
    description:
      "Choose your fabric, upload your design, request your quote. Custom sublimated uniforms for 10 sports.",
    url: SITE_URL,
    siteName: "Elpuo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elpuo — Custom Sports Uniforms",
    description:
      "Custom sublimated team uniforms for 10 sports. Configure, upload artwork, request a quote.",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": abs("/#organization"),
  name: ORG.name,
  legalName: ORG.legalName,
  url: SITE_URL,
  logo: ORG.logo,
  description: ORG.description,
  sameAs: ORG.sameAs,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: ORG.email,
      telephone: ORG.phone,
      areaServed: "Worldwide",
      availableLanguage: ["en"],
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": abs("/#website"),
  url: SITE_URL,
  name: "Elpuo",
  description: ORG.description,
  inLanguage: "en",
  publisher: { "@id": abs("/#organization") },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} ${grotesk.variable}`}>
      <body className="min-h-dvh antialiased">
        <JsonLd data={[orgSchema, websiteSchema]} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />

        {/* Google tag (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GTAG_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
