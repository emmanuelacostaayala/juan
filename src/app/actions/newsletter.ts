"use server";

import crypto from "node:crypto";
import { sql } from "@/lib/db";
import { mailer, FROM, CONTACT_INBOX } from "@/lib/mail";
import { renderNewsletterEmail } from "@/lib/newsletter-template";

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
 */
const BIENVENIDA_ASUNTO = "Gracias por suscribirte";
const BIENVENIDA_TEXTO = [
  "Hola:",
  "",
  "Gracias por suscribirte a la newsletter de Juan Andrés Romero. A partir de ahora recibirás en este correo cada nueva publicación.",
  "",
  "Si no te suscribiste tú, puedes darte de baja con el enlace que aparece al final de este mensaje.",
].join("\n");

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

async function avisarAlta(email: string, vuelve: boolean): Promise<void> {
  const [{ activos }] = await sql<{ activos: number }[]>`
    SELECT count(*)::int AS activos FROM subscribers WHERE status = 'active'
  `;
  const cuando = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Santo_Domingo",
  }).format(new Date());
  const lineas = [
    `${email} se ha suscrito a la newsletter de juanandresromero.es${vuelve ? " (vuelve después de haberse dado de baja)" : ""}.`,
    `Fecha: ${cuando} (hora de República Dominicana).`,
    `Suscriptores activos ahora: ${activos}.`,
    "Es un aviso automático de la web: no hace falta contestarlo.",
  ];
  await mailer.sendMail({
    from: FROM,
    to: AVISO_ALTA_PARA.join(", "),
    subject: `Nueva suscripción a la newsletter: ${email}`,
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

async function enviarBienvenida(email: string, token: string): Promise<void> {
  const baja = `${SITE}/unsubscribe?t=${encodeURIComponent(token)}`;
  const bajaPost = `${SITE}/api/unsubscribe?t=${encodeURIComponent(token)}`;
  const { html, text } = renderNewsletterEmail({
    title: BIENVENIDA_ASUNTO,
    body: BIENVENIDA_TEXTO,
    unsubscribeUrl: baja,
  });
  await mailer.sendMail({
    from: FROM,
    to: email,
    subject: BIENVENIDA_ASUNTO,
    html,
    text,
    headers: {
      "List-Unsubscribe": `<${bajaPost}>, <${baja}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      "X-Auto-Response-Suppress": "All",
      "Auto-Submitted": "auto-generated",
    },
  });
}

export async function subscribeNewsletter(
  _prev: NewsletterState | null,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const honeypot = String(formData.get("company") ?? "").trim();

  if (honeypot) return { ok: true };

  if (!email) return { ok: false, error: "Introduce tu correo." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Correo no válido." };

  let token: string | null = null;
  let yaEstabaActivo = false;
  let existiaAntes = false;
  try {
    const antes = await sql<{ status: string }[]>`
      SELECT status FROM subscribers WHERE email = ${email}
    `;
    yaEstabaActivo = antes[0]?.status === "active";
    existiaAntes = antes.length > 0;
    const filas = await sql<{ unsubscribe_token: string | null }[]>`
      INSERT INTO subscribers (email, status, unsubscribe_token)
      VALUES (${email}, 'active', ${newToken()})
      ON CONFLICT (email) DO UPDATE SET
        status = 'active',
        unsubscribe_token = COALESCE(subscribers.unsubscribe_token, EXCLUDED.unsubscribe_token)
      RETURNING unsubscribe_token
    `;
    token = filas[0]?.unsubscribe_token ?? null;
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
          enviarBienvenida(email, token).catch((err) => console.error("[newsletter] bienvenida no enviada", err)),
          avisarAlta(email, existiaAntes).catch((err) => console.error("[newsletter] aviso de alta no enviado", err)),
        ]);
        await Promise.race([envios, new Promise<void>((res) => setTimeout(res, ESPERA_MAX_MS))]);
      }
    } catch (err) {
      console.error("[newsletter] bienvenida y aviso no enviados", err);
    }
  }
  return { ok: true };
}
