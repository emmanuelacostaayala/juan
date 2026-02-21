import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arq. Juan Andrés Romero | Arquitectura del Futuro",
  description: "Construyendo futuro, creando legado. Página oficial del Arquitecto Juan Andrés Romero y visión detrás de Larimar City & Resort.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}
