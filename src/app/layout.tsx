import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kairos Systems – Machen Sie aus Ihrer Firma ein System",
  description: "Wir bauen mit Ihnen ein holistisches Unternehmenssystem: Werte, Prozesse, Verantwortlichkeiten, Standards, Führung – und integrieren Digitalisierung & KI logisch.",
  keywords: ["Unternehmenssystem", "Organisationsentwicklung", "Systemarchitektur", "KMU", "Schweiz", "Beratung"],
  authors: [{ name: "Kairos Systems" }],
  openGraph: {
    title: "Kairos Systems – Machen Sie aus Ihrer Firma ein System",
    description: "Ein Unternehmen, das trägt – ohne Sie permanent zu binden.",
    type: "website",
    locale: "de_CH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
