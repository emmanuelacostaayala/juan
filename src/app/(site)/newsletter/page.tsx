import type { Metadata } from "next";
import NewsletterBlock from "@/components/NewsletterBlock";

/*
 * Enlace para compartir la newsletter: juanandresromero.es/newsletter
 * Tiene su propia tarjeta al compartirlo (WhatsApp, redes, email…): logotipo y
 * «NEWSLETTER» sobre fondo negro (public/brand/newsletter-og.png).
 */

const TITLE = "Newsletter · Juan Andrés Romero";
const DESCRIPTION =
  "Suscríbete a la newsletter: reflexiones sobre urbanismo, liderazgo y los avances de Larimar City.";
const IMAGE = {
  url: "/brand/newsletter-og.png",
  width: 1200,
  height: 630,
  alt: "Juan Andrés Romero · Newsletter",
};

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/newsletter" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/newsletter",
    siteName: "Juan Andrés Romero",
    locale: "es_ES",
    type: "website",
    images: [IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [IMAGE.url],
  },
};

export default function NewsletterPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--color-ink)" }}>
      <NewsletterBlock />
    </main>
  );
}
