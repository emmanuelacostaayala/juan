import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://juanandresromero.com"),
  title: {
    default: "Juan Andrés Romero — Arquitectura del futuro",
    template: "%s · Juan Andrés Romero",
  },
  description:
    "Construyendo futuro, creando legado. Sitio oficial del Arquitecto Juan Andrés Romero, Presidente de CLERHP y creador de Larimar City & Resort.",
  openGraph: {
    title: "Juan Andrés Romero — Arquitectura del futuro",
    description:
      "Presidente de CLERHP y creador de Larimar City & Resort.",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={playfair.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        />
        <style>{`:root { --font-satoshi: 'Satoshi', system-ui, sans-serif; }`}</style>
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
