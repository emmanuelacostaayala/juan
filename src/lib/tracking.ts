import "server-only";

import crypto from "node:crypto";
import { sql } from "@/lib/db";

/*
 * Medición de la newsletter en nuestro propio servidor (19-nov-2026).
 * Todo se guarda en la misma base de datos Postgres de la web:
 *   - subscribers.source / referrer_host / landing → de dónde viene cada alta.
 *   - newsletter_visits → visitas a /newsletter (personas y vistas previas de redes).
 *   - email_sends / email_clicks → correos enviados y clics en sus enlaces.
 * No se guardan IPs: solo un identificador anónimo (hash) para contar visitantes únicos por día.
 */

const SITE = "https://juanandresromero.es";
const SECRET = process.env.ADMIN_SECRET || "dev-secret-solo-local";

let ready: Promise<void> | null = null;
export function ensureTrackingTables(): Promise<void> {
  if (!ready) {
    const p = (async () => {
      await sql`
        ALTER TABLE subscribers
          ADD COLUMN IF NOT EXISTS source TEXT,
          ADD COLUMN IF NOT EXISTS referrer_host TEXT,
          ADD COLUMN IF NOT EXISTS landing TEXT
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS newsletter_visits (
          id SERIAL PRIMARY KEY,
          path TEXT NOT NULL,
          source TEXT,
          campaign TEXT,
          referrer_host TEXT,
          bot TEXT,
          visitor TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_nl_visits_created ON newsletter_visits (created_at)`;
      await sql`
        CREATE TABLE IF NOT EXISTS email_sends (
          id SERIAL PRIMARY KEY,
          campaign TEXT NOT NULL,
          subscriber_id INTEGER,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS email_clicks (
          id SERIAL PRIMARY KEY,
          campaign TEXT NOT NULL,
          url TEXT NOT NULL,
          subscriber_id INTEGER,
          bot TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_email_clicks_campaign ON email_clicks (campaign)`;
    })().catch((err) => {
      ready = null; // reintenta en la próxima llamada
      throw err;
    });
    ready = p;
  }
  return ready;
}

/* ── Bots y vistas previas ─────────────────────────────────────────────────
   Cuando alguien comparte un enlace, la app pide la página para montar la tarjeta.
   Eso nos dice que se ha compartido y en qué red. Ojo: algunas redes la guardan
   en caché unos días, así que es un mínimo, no el total. */
const PREVIEW_BOTS: [RegExp, string][] = [
  [/WhatsApp/i, "WhatsApp"],
  [/LinkedInBot/i, "LinkedIn"],
  // iMessage se presenta como «facebookexternalhit … Twitterbot»: por eso Facebook va antes que X.
  [/facebookexternalhit|Facebot|meta-externalagent/i, "Facebook / Instagram / iMessage"],
  [/Twitterbot/i, "X"],
  [/TelegramBot/i, "Telegram"],
  [/Slackbot/i, "Slack"],
  [/Discordbot/i, "Discord"],
  [/SkypeUriPreview|Teams/i, "Teams / Skype"],
  [/Pinterest/i, "Pinterest"],
];
const OTHER_BOT = /bot|crawl|spider|slurp|preview|fetch|scan|monitor|headless|python|curl|wget|httpclient|safelinks|proofpoint|mimecast|barracuda/i;

/* Devuelve el nombre de la red si es una vista previa, "otro bot" si es otro robot
   (buscadores, antivirus del correo…) o null si parece una persona. */
export function classifyAgent(ua: string | null): string | null {
  const u = ua ?? "";
  if (!u) return "otro bot";
  for (const [re, name] of PREVIEW_BOTS) if (re.test(u)) return name;
  return OTHER_BOT.test(u) ? "otro bot" : null;
}
export const PREVIEW_NAMES = PREVIEW_BOTS.map(([, n]) => n);

/* ── Origen ─────────────────────────────────────────────────────────────── */
const HOSTS: [RegExp, string][] = [
  [/(^|\.)(instagram\.com)$/, "instagram"],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, "facebook"],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, "linkedin"],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, "x"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube"],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, "whatsapp"],
  [/(^|\.)(google\.[a-z.]+)$/, "google"],
  [/(^|\.)(bing\.com|duckduckgo\.com)$/, "buscadores"],
  [/(^|\.)(mail\.google\.com|outlook\.[a-z.]+|mail\.yahoo\.com)$/, "email"],
  [/(^|\.)juanandresromero\.es$/, "web"],
];

export function cleanTag(v: string | null | undefined, max = 60): string | null {
  const s = (v ?? "").toLowerCase().trim().replace(/[^a-z0-9._\- ]/g, "").slice(0, max);
  return s || null;
}

export function hostOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\.|^m\.|^l\.|^lm\./, "").toLowerCase().slice(0, 100);
  } catch {
    return null;
  }
}

/* Origen legible: primero el que pongamos en el enlace (?utm_source= o ?ref=),
   si no, la web de la que viene; si no hay nada, "directo" (WhatsApp, apps, enlace copiado…). */
export function resolveSource(tag: string | null, referrerHost: string | null): string {
  if (tag) return tag;
  if (referrerHost) {
    for (const [re, name] of HOSTS) if (re.test(referrerHost)) return name;
    return referrerHost;
  }
  return "directo";
}

export function visitorId(ip: string, ua: string): string {
  const day = new Date().toISOString().slice(0, 10);
  return crypto.createHmac("sha256", SECRET).update(`${day}|${ip}|${ua}`).digest("base64url").slice(0, 22);
}

/* ── Enlaces de los correos ─────────────────────────────────────────────── */
function sign(url: string, campaign: string, sid: string): string {
  return crypto.createHmac("sha256", SECRET).update(`${url}|${campaign}|${sid}`).digest("base64url").slice(0, 16);
}

export function trackedUrl(url: string, campaign: string, subscriberId?: number | null): string {
  const sid = subscriberId ? String(subscriberId) : "";
  const q = new URLSearchParams({ u: url, c: campaign });
  if (sid) q.set("s", sid);
  q.set("k", sign(url, campaign, sid));
  return `${SITE}/r?${q.toString()}`;
}

export function verifyTracked(url: string, campaign: string, sid: string, k: string): boolean {
  const expected = sign(url, campaign, sid);
  return k.length === expected.length && crypto.timingSafeEqual(Buffer.from(k), Buffer.from(expected));
}

/* Cambia los enlaces [texto](https://…) del Markdown por enlaces medidos.
   Las imágenes ![…](…) y el enlace de baja (va aparte, en el pie) no se tocan. */
export function trackMarkdownLinks(md: string, campaign: string, subscriberId?: number | null): string {
  return md.replace(/(^|[^!])\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, (_m, pre, text, url) => {
    if (/\/unsubscribe/.test(url)) return `${pre}[${text}](${url})`;
    return `${pre}[${text}](${trackedUrl(url, campaign, subscriberId)})`;
  });
}

export async function logSend(campaign: string, subscriberId: number | null): Promise<void> {
  try {
    await ensureTrackingTables();
    await sql`INSERT INTO email_sends (campaign, subscriber_id) VALUES (${campaign}, ${subscriberId})`;
  } catch (err) {
    console.error("[tracking] envío no registrado", err);
  }
}
