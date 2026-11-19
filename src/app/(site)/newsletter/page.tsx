import type { Metadata } from "next";
import NewsletterBlock from "@/components/NewsletterBlock";

// Enlace directo a la suscripción (para redes: juanandresromero.es/newsletter).
// Usa el mismo formulario que la portada, sin la intro ni el resto de secciones.
export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Suscríbete a la newsletter de Juan Andrés Romero: avances de CLERHP y Larimar City, decisiones y aprendizajes.",
};

export default function NewsletterPage() {
  return (
    <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", paddingTop: "5rem" }}>
      <div style={{ width: "100%" }}>
        <NewsletterBlock />
      </div>
    </main>
  );
}
