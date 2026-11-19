import type { Metadata } from "next";
import { headers } from "next/headers";
import { after } from "next/server";
import NewsletterBlock from "@/components/NewsletterBlock";
import { sql } from "@/lib/db";
import {
  classifyAgent,
  cleanTag,
  ensureTrackingTables,
  hostOf,
  resolveSource,
  visitorId,
} from "@/lib/tracking";

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

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? null;

/* Cada visita a esta página se guarda en newsletter_visits (ver lib/tracking.ts):
   personas, con su origen, y vistas previas de redes (= veces que se ha compartido). */
async function registrarVisita(sp: Record<string, string | string[] | undefined>) {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  // Las precargas del propio navegador no son visitas.
  if (h.get("next-router-prefetch") || h.get("purpose") === "prefetch" || h.get("sec-purpose")?.includes("prefetch")) return;
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "";
  const bot = classifyAgent(ua);
  const tag = cleanTag(one(sp.utm_source) ?? one(sp.ref) ?? one(sp.src));
  const refHost = hostOf(h.get("referer"));
  const source = resolveSource(tag, refHost === "juanandresromero.es" ? null : refHost);
  const campaign = cleanTag(one(sp.utm_campaign));
  const visitor = visitorId(ip, ua);
  after(async () => {
    try {
      await ensureTrackingTables();
      await sql`
        INSERT INTO newsletter_visits (path, source, campaign, referrer_host, bot, visitor)
        VALUES ('/newsletter', ${source}, ${campaign}, ${refHost}, ${bot}, ${visitor})
      `;
    } catch (err) {
      console.error("[tracking] visita no registrada", err);
    }
  });
}

export default async function NewsletterPage({ searchParams }: Props) {
  await registrarVisita(await searchParams).catch((err) => console.error("[tracking]", err));
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--color-ink)" }}>
      <NewsletterBlock />
    </main>
  );
}
