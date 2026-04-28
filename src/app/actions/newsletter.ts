"use server";

import { sql } from "@/lib/db";

export type NewsletterState = {
  ok: boolean;
  error?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeNewsletter(
  _prev: NewsletterState | null,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const honeypot = String(formData.get("company") ?? "").trim();

  if (honeypot) return { ok: true };

  if (!email) return { ok: false, error: "Introduce tu correo." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Correo no válido." };

  try {
    await sql`
      INSERT INTO subscribers (email, status)
      VALUES (${email}, 'active')
      ON CONFLICT (email) DO UPDATE SET status = 'active'
    `;
    return { ok: true };
  } catch (err) {
    console.error("[newsletter] insert error", err);
    return {
      ok: false,
      error: "No pudimos guardar tu correo. Inténtalo de nuevo en unos minutos.",
    };
  }
}
