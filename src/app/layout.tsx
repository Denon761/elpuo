import type { Metadata } from "next";
import { Anton, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

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
  metadataBase: new URL("https://elpuo.example"),
  title: {
    default: "Elpuo — Custom Sports Uniforms, Sublimated In-House",
    template: "%s · Elpuo",
  },
  description:
    "Custom team uniforms for 10 sports. Full sublimation, tackle twill and embroidery, player names and numbers. Choose your fabric and options, upload your design and request a quote.",
  keywords: [
    "custom sports uniforms",
    "sublimated jerseys",
    "team kit builder",
    "custom soccer jerseys",
    "custom basketball uniforms",
  ],
  openGraph: {
    title: "Elpuo — Custom Sports Uniforms",
    description:
      "Choose your fabric, upload your design, request your quote. Custom sublimated uniforms for 10 sports.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} ${grotesk.variable}`}>
      <body className="min-h-dvh antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
