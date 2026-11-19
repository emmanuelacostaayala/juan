import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

/*
 * Acceso al vídeo exclusivo. Cada suscriptor tiene un enlace personal
 * (/video/acceso?t=…) que deja una cookie en su navegador. El enlace y la cookie
 * solo valen mientras la persona siga suscrita: si se da de baja, deja de verlo.
 * Si alguien reenvía su enlace, quien lo reciba entra como esa persona; por eso
 * cada enlace es personal y se puede saber de quién era.
 */

const SECRET = process.env.ADMIN_SECRET ?? "dev-only-not-secure-change-me";
const SITE = "https://juanandresromero.es";
export const VIDEO_COOKIE = "nl_video";
export const VIDEO_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(`video:${data}`).digest("hex").slice(0, 32);
}

export function videoAccessToken(email: string): string {
  const data = Buffer.from(email.trim().toLowerCase()).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function videoAccessUrl(email: string): string {
  return `${SITE}/video/acceso?t=${encodeURIComponent(videoAccessToken(email))}`;
}

function emailFromToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = sign(data);
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    return Buffer.from(data, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

export async function isActiveSubscriber(email: string): Promise<boolean> {
  const rows = await sql<{ status: string }[]>`
    SELECT status FROM subscribers WHERE email = ${email.trim().toLowerCase()}
  `;
  return rows[0]?.status === "active";
}

/* Correo del suscriptor con acceso válido (token válido y suscripción activa). */
export async function subscriberFromToken(token: string | undefined | null): Promise<string | null> {
  const email = emailFromToken(token);
  if (!email) return null;
  try {
    return (await isActiveSubscriber(email)) ? email : null;
  } catch {
    return null;
  }
}

export async function grantVideoAccess(email: string): Promise<void> {
  const c = await cookies();
  c.set(VIDEO_COOKIE, videoAccessToken(email), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: VIDEO_COOKIE_MAX_AGE,
  });
}

export async function currentVideoViewer(): Promise<string | null> {
  const c = await cookies();
  return subscriberFromToken(c.get(VIDEO_COOKIE)?.value);
}
