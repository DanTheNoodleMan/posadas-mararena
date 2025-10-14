import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import CookieConsent from "@/components/Cookies";
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: {
    default: "Posadas Mararena | Posadas de Lujo en Chirimena - Higuerote",
    template: "%s | Posadas Mararena"
  },
  description: "Posadas de lujo frente al mar en Chirimena-Higuerote. Vista al Mar e Inmarcesible ofrecen 17 habitaciones con piscinas infinita, churuatas tradicionales y espacios para eventos. A 2 horas de Caracas.",
  authors: [{ name: "Posadas Mararena" }],
  creator: "Posadas Mararena",
  publisher: "Posadas Mararena",
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: "https://posadasmararena.com",
    siteName: "Posadas Mararena",
    title: "Posadas Mararena | Posadas de Lujo en Chirimena - Higuerote",
    description: "Posadas de lujo frente al mar en Chirimena-Higuerote. Piscinas infinita, churuatas tradicionales y espacios para hasta 31 huéspedes. Perfecto para familias y eventos especiales.",
    images: [
      {
        url: "/images/posadas/inmarcesible-posada.webp", // Crear: 1200x630px de mejor foto de piscina/vista
        width: 1200,
        height: 630,
        alt: "Posadas Mararena - Posadas de Lujo en Chirimena",
      }
    ],
  },

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // Manifest
  manifest: "/site.webmanifest",


  // Alternates (idiomas futuros)
  alternates: {
    canonical: "https://posadasmararena.com",
    // languages: {
    //   'en-US': 'https://posadasmararena.com/en',
    //   'es-VE': 'https://posadasmararena.com',
    // },
  },

  // Otros
  category: "travel",
  metadataBase: new URL('https://posadasmararena.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaID = process.env.NEXT_PUBLIC_GOOGLE_TAG;
  
  return (
    <html lang="es-VE">
      <body>
        {children}
        <Analytics />
        <CookieConsent />
        {gaID && <GoogleAnalytics gaId={gaID} />}
      </body>
    </html>
  );
}
