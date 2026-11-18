"use server";

import crypto from "node:crypto";
import { sql } from "@/lib/db";
import { mailer, FROM } from "@/lib/mail";
import { renderNewsletterEmail } from "@/lib/newsletter-template";
import { getWelcomeEmail } from "@/lib/welcome";

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
 * El asunto, el texto y la portada se editan en /admin → "Mensaje de bienvenida"
 * (ver src/lib/welcome.ts); allí también se puede desactivar.
 */

/* Freno contra abusos: el formulario es público y cada bienvenida sale por el SMTP
   de Zoho, que tiene un cupo por hora. Si alguien da de alta correos ajenos en masa,
   las bienvenidas se paran (la suscripción se guarda igual) y no se gasta el cupo
   que necesita la newsletter. Una web personal no tiene 30 altas reales en una hora. */
const MAX_ALTAS_POR_HORA = 30;
/* Lo que se espera al SMTP antes de contestar al formulario. */
const ESPERA_MAX_MS = 8000;

function newToken(): string {
  return crypto.randomBytes(24).toString("base64url");
}

async function enviarBienvenida(email: string, token: string): Promise<void> {
  const baja = `${SITE}/unsubscribe?t=${encodeURIComponent(token)}`;
  const bajaPost = `${SITE}/api/unsubscribe?t=${encodeURIComponent(token)}`;
  const bienvenida = await getWelcomeEmail();
  if (!bienvenida.enabled) return;
  const { html, text } = renderNewsletterEmail({
    title: bienvenida.subject,
    body: bienvenida.body,
    unsubscribeUrl: baja,
    coverImageUrl: bienvenida.coverImageUrl,
  });
  await mailer.sendMail({
    from: FROM,
    to: email,
    subject: bienvenida.subject,
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
  try {
    const antes = await sql<{ status: string }[]>`
      SELECT status FROM subscribers WHERE email = ${email}
    `;
    yaEstabaActivo = antes[0]?.status === "active";
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

  // La suscripción ya está guardada: un fallo de la bienvenida solo se registra.
  if (!yaEstabaActivo && token) {
    try {
      const [{ n }] = await sql<{ n: number }[]>`
        SELECT count(*)::int AS n FROM subscribers WHERE created_at > now() - interval '1 hour'
      `;
      if (n > MAX_ALTAS_POR_HORA) {
        console.warn(`[newsletter] bienvenida NO enviada: ${n} altas en la última hora (freno de abusos)`);
      } else {
        // El .catch va pegado al envío: si tarda más que la espera y luego falla, el
        // error se registra y no queda como rechazo sin atender.
        const envio = enviarBienvenida(email, token).catch((err) =>
          console.error("[newsletter] bienvenida no enviada", err),
        );
        await Promise.race([envio, new Promise<void>((res) => setTimeout(res, ESPERA_MAX_MS))]);
      }
    } catch (err) {
      console.error("[newsletter] bienvenida no enviada", err);
    }
  }
  return { ok: true };
}
