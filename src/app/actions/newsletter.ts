"use server";

import crypto from "node:crypto";
import { sql } from "@/lib/db";
import { mailer, FROM, CONTACT_INBOX } from "@/lib/mail";
import { renderNewsletterEmail } from "@/lib/newsletter-template";
import { getWelcomeMessage } from "@/lib/welcome";
import { cleanName, personalize, type Person } from "@/lib/personalize";
import { ensureSubscriberNameColumn } from "@/lib/subscribers";
import { videoAccessUrl } from "@/lib/video-access";
import {
  cleanTag,
  ensureTrackingTables,
  hostOf,
  logSend,
  resolveSource,
  trackMarkdownLinks,
} from "@/lib/tracking";

export type NewsletterState = {
  ok: boolean;
  error?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE = "https://juanandresromero.es";

/*
 * Correo de bienvenida (17-nov-2026). Hasta ahora suscribirse no mandaba nada y la
 * gente creía que no funcionaba (lo avisó Marta). Solo sale a quien se apunta de
 * nuevo o vuelve después de darse de baja: a quien ya estaba activo no se le repite.
 * El asunto y el texto se editan en /admin (Plantilla → «Mensaje de bienvenida»).
 */

/* Freno contra abusos: el formulario es público y cada bienvenida sale por el SMTP
   de Zoho, que tiene un cupo por hora. Si alguien da de alta correos ajenos en masa,
   las bienvenidas se paran (la suscripción se guarda igual) y no se gasta el cupo
   que necesita la newsletter. Una web personal no tiene 30 altas reales en una hora. */
const MAX_ALTAS_POR_HORA = 30;
/* Lo que se espera al SMTP antes de contestar al formulario. */
const ESPERA_MAX_MS = 8000;

/*
 * Aviso interno de cada alta (18-nov-2026, lo pidió Enmanuel para Marta): a marketing@ y a
 * info@ les llega un correo con quién se suscribió. Sale en los mismos casos que la
 * bienvenida (alta nueva o vuelta tras una baja) y con el mismo freno de abusos, para que
 * un alta masiva de correos ajenos no les llene la bandeja.
 */
const AVISO_ALTA_PARA = Array.from(
  new Set(["marketing@juanandresromero.es", CONTACT_INBOX].map((c) => c.trim().toLowerCase())),
);

function escHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

async function avisarAlta(email: string, fullName: string, vuelve: boolean): Promise<void> {
  const [{ activos }] = await sql<{ activos: number }[]>`
    SELECT count(*)::int AS activos FROM subscribers WHERE status = 'active'
  `;
  const cuando = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Santo_Domingo",
  }).format(new Date());
  const lineas = [
    `${fullName} (${email}) se ha suscrito a la newsletter de juanandresromero.es${vuelve ? " (vuelve después de haberse dado de baja)" : ""}.`,
    `Fecha: ${cuando} (hora de República Dominicana).`,
    `Suscriptores activos ahora: ${activos}.`,
    "Es un aviso automático de la web: no hace falta contestarlo.",
  ];
  await mailer.sendMail({
    from: FROM,
    to: AVISO_ALTA_PARA.join(", "),
    subject: `Nueva suscripción a la newsletter: ${fullName} (${email})`,
    text: lineas.join("\n\n"),
    html: lineas.map((l) => `<p style="font-family:Arial,sans-serif;font-size:14px;color:#1f2937;margin:0 0 12px">${escHtml(l)}</p>`).join(""),
    headers: {
      "X-Auto-Response-Suppress": "All",
      "Auto-Submitted": "auto-generated",
    },
  });
}

function newToken(): string {
  return crypto.randomBytes(24).toString("base64url");
}

async function enviarBienvenida(email: string, person: Person, token: string, subscriberId: number | null): Promise<void> {
  const baja = `${SITE}/unsubscribe?t=${encodeURIComponent(token)}`;
  const bajaPost = `${SITE}/api/unsubscribe?t=${encodeURIComponent(token)}`;
  const welcome = await getWelcomeMessage();
  const subject = personalize(welcome.subject, person);
  // Los enlaces de la bienvenida pasan por /r para contar los clics (campaña «bienvenida»).
  const body = trackMarkdownLinks(personalize(welcome.body, person), "bienvenida", subscriberId);
  const { html, text } = renderNewsletterEmail({
    title: subject,
    body,
    unsubscribeUrl: baja,
  });
  await mailer.sendMail({
    from: FROM,
    to: email,
    subject,
    html,
    text,
    headers: {
      "List-Unsubscribe": `<${bajaPost}>, <${baja}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      "X-Auto-Response-Suppress": "All",
      "Auto-Submitted": "auto-generated",
    },
  });
  await logSend("bienvenida", subscriberId);
}

export async function subscribeNewsletter(
  _prev: NewsletterState | null,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const honeypot = String(formData.get("company") ?? "").trim();
  const name = cleanName(String(formData.get("name") ?? ""));
  const lastName = cleanName(String(formData.get("lastName") ?? ""));

  if (honeypot) return { ok: true };

  if (!name) return { ok: false, error: "Introduce tu nombre." };
  if (!email) return { ok: false, error: "Introduce tu correo." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Correo no válido." };

  // Origen del alta (lo rellena el formulario; ver NewsletterBlock).
  const refHost = hostOf(String(formData.get("ref") ?? ""));
  const source = resolveSource(cleanTag(String(formData.get("src") ?? "")), refHost);
  const landing = String(formData.get("landing") ?? "").slice(0, 100) || null;

  let token: string | null = null;
  let subscriberId: number | null = null;
  let yaEstabaActivo = false;
  let existiaAntes = false;
  try {
    await ensureSubscriberNameColumn();
    await ensureTrackingTables().catch((err) => console.error("[tracking] tablas", err));
    const antes = await sql<{ status: string }[]>`
      SELECT status FROM subscribers WHERE email = ${email}
    `;
    yaEstabaActivo = antes[0]?.status === "active";
    existiaAntes = antes.length > 0;
    const filas = await sql<{ id: number; unsubscribe_token: string | null }[]>`
      INSERT INTO subscribers (email, name, last_name, status, unsubscribe_token)
      VALUES (${email}, ${name}, ${lastName || null}, 'active', ${newToken()})
      ON CONFLICT (email) DO UPDATE SET
        status = 'active',
        name = EXCLUDED.name,
        last_name = COALESCE(EXCLUDED.last_name, subscribers.last_name),
        unsubscribe_token = COALESCE(subscribers.unsubscribe_token, EXCLUDED.unsubscribe_token)
      RETURNING id, unsubscribe_token
    `;
    token = filas[0]?.unsubscribe_token ?? null;
    subscriberId = filas[0]?.id ?? null;
    // El origen se guarda aparte: si las columnas aún no existieran, el alta no falla.
    // Solo se apunta en altas nuevas o vueltas, no cuando alguien ya activo repite el formulario.
    if (subscriberId && !yaEstabaActivo) {
      await sql`
        UPDATE subscribers SET source = ${source}, referrer_host = ${refHost}, landing = ${landing}
        WHERE id = ${subscriberId}
      `.catch((err) => console.error("[tracking] origen no guardado", err));
    }
  } catch (err) {
    console.error("[newsletter] insert error", err);
    return {
      ok: false,
      error: "No pudimos guardar tu correo. Inténtalo de nuevo en unos minutos.",
    };
  }

  // La suscripción ya está guardada: un fallo de la bienvenida o del aviso solo se registra.
  if (!yaEstabaActivo && token) {
    try {
      const [{ n }] = await sql<{ n: number }[]>`
        SELECT count(*)::int AS n FROM subscribers WHERE created_at > now() - interval '1 hour'
      `;
      if (n > MAX_ALTAS_POR_HORA) {
        console.warn(`[newsletter] bienvenida y aviso NO enviados: ${n} altas en la última hora (freno de abusos)`);
      } else {
        // Los dos correos salen a la vez. El .catch va pegado a cada envío: si tarda más
        // que la espera y luego falla, el error se registra y no queda como rechazo sin atender.
        const envios = Promise.all([
          enviarBienvenida(email, { name, lastName, videoUrl: videoAccessUrl(email) }, token, subscriberId).catch((err) => console.error("[newsletter] bienvenida no enviada", err)),
          avisarAlta(email, `${name} ${lastName}`.trim(), existiaAntes).catch((err) => console.error("[newsletter] aviso de alta no enviado", err)),
        ]);
        await Promise.race([envios, new Promise<void>((res) => setTimeout(res, ESPERA_MAX_MS))]);
      }
    } catch (err) {
      console.error("[newsletter] bienvenida y aviso no enviados", err);
    }
  }
  return { ok: true };
}
