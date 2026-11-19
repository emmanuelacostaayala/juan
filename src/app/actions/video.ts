"use server";

import { sql } from "@/lib/db";
import { mailer, FROM } from "@/lib/mail";
import { renderNewsletterEmail } from "@/lib/newsletter-template";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { grantVideoAccess, videoAccessUrl } from "@/lib/video-access";
import { getExclusiveVideo } from "@/lib/video-settings";

export type VideoGateState = { ok: boolean; error?: string; sent?: boolean; unlocked?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * Formulario de /video para quien no tiene acceso:
 * - Si el correo ya está suscrito, no se abre aquí (cualquiera podría escribir el
 *   correo de otro): se le manda su enlace personal a ese correo.
 * - Si no está suscrito, se suscribe (recibe la bienvenida) y ve el vídeo al momento.
 */
export async function unlockVideo(
  _prev: VideoGateState | null,
  formData: FormData,
): Promise<VideoGateState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (String(formData.get("company") ?? "").trim()) return { ok: true, sent: true };
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: "Correo no válido." };

  let active = false;
  let unsubToken: string | null = null;
  try {
    const rows = await sql<{ status: string; unsubscribe_token: string | null }[]>`
      SELECT status, unsubscribe_token FROM subscribers WHERE email = ${email}
    `;
    active = rows[0]?.status === "active";
    unsubToken = rows[0]?.unsubscribe_token ?? null;
  } catch (err) {
    console.error("[video] error al comprobar suscriptor", err);
    return { ok: false, error: "No se pudo comprobar. Inténtalo de nuevo en unos minutos." };
  }

  if (active) {
    try {
      const link = videoAccessUrl(email);
      const { html, text } = renderNewsletterEmail({
        title: "Tu acceso al vídeo",
        body: `Aquí tienes tu enlace personal para ver **${(await getExclusiveVideo()).title}**:\n\n[Ver el vídeo](${link})\n\nEs solo para ti: funciona mientras sigas suscrito/a a la newsletter.`,
        unsubscribeUrl: `https://juanandresromero.es/unsubscribe?t=${encodeURIComponent(unsubToken ?? "")}`,
      });
      await mailer.sendMail({ from: FROM, to: email, subject: "Tu acceso al vídeo", html, text });
    } catch (err) {
      console.error("[video] enlace de acceso no enviado", err);
      return { ok: false, error: "No se pudo enviar el enlace. Inténtalo de nuevo en unos minutos." };
    }
    return { ok: true, sent: true };
  }

  const res = await subscribeNewsletter(null, formData);
  if (!res.ok) return { ok: false, error: res.error };
  await grantVideoAccess(email);
  return { ok: true, unlocked: true };
}
