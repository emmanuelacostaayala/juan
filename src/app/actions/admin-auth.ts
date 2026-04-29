"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { mailer, FROM } from "@/lib/mail";
import { ADMIN_EMAILS, setSession, clearSession } from "@/lib/session";

const CODE_TTL_MIN = 10;
const MAX_ATTEMPTS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function generateCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export type RequestState = {
  ok: boolean;
  sent?: boolean;
  email?: string;
  error?: string;
};

export async function requestAdminCode(
  _prev: RequestState | null,
  formData: FormData,
): Promise<RequestState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Email no válido." };
  }

  if (!ADMIN_EMAILS.includes(email)) {
    return { ok: false, error: "Este correo no tiene acceso al panel." };
  }

  const code = generateCode();
  const expires = new Date(Date.now() + CODE_TTL_MIN * 60_000);

  try {
    await sql`
      INSERT INTO admin_codes (email, code_hash, expires_at)
      VALUES (${email}, ${hashCode(code)}, ${expires})
    `;
    await mailer.sendMail({
      from: FROM,
      to: email,
      subject: `Tu código de acceso: ${code}`,
      text: `Tu código de acceso al panel es: ${code}\n\nVálido durante ${CODE_TTL_MIN} minutos.\n\nSi no has solicitado este código, ignora este mensaje.`,
      html: `<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:480px;color:#1a1a18;line-height:1.5">
        <p>Tu código de acceso al panel:</p>
        <p style="font-size:34px;font-weight:700;letter-spacing:0.2em;padding:1.25rem;background:#f6f6f4;border-radius:10px;text-align:center;margin:1rem 0;">${code}</p>
        <p style="color:#666;font-size:14px">Válido durante ${CODE_TTL_MIN} minutos. Si no lo has solicitado, ignora este mensaje.</p>
      </div>`,
    });
  } catch (err) {
    console.error("[admin-auth] send code error", err);
    return { ok: false, error: "No se pudo enviar el código. Inténtalo de nuevo." };
  }

  return { ok: true, sent: true, email };
}

export type VerifyState = {
  ok: boolean;
  error?: string;
};

export async function verifyAdminCode(
  _prev: VerifyState | null,
  formData: FormData,
): Promise<VerifyState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const code = String(formData.get("code") ?? "").trim();

  if (!email || !code) return { ok: false, error: "Faltan datos." };
  if (!ADMIN_EMAILS.includes(email)) return { ok: false, error: "Código inválido." };

  type Row = { code_hash: string; attempts: number; created_at: Date };
  const rows = await sql<Row[]>`
    SELECT code_hash, attempts, created_at
    FROM admin_codes
    WHERE email = ${email} AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (rows.length === 0) {
    return { ok: false, error: "Código caducado. Solicita uno nuevo." };
  }

  const row = rows[0];

  if (row.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: "Demasiados intentos. Solicita un código nuevo." };
  }

  if (row.code_hash !== hashCode(code)) {
    await sql`
      UPDATE admin_codes
      SET attempts = attempts + 1
      WHERE email = ${email} AND created_at = ${row.created_at}
    `;
    return { ok: false, error: "Código incorrecto." };
  }

  await sql`DELETE FROM admin_codes WHERE email = ${email}`;
  await setSession(email);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearSession();
  redirect("/admin/login");
}
