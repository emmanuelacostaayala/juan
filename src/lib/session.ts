import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SECRET ?? "dev-only-not-secure-change-me";
const COOKIE = "admin_session";
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "marketing@juanandresromero.es")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export type SessionPayload = { email: string; exp: number };

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function buildToken(email: string): string {
  const payload: SessionPayload = { email, exp: Date.now() + TTL_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifyToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  if (!constantTimeEqual(sig, sign(data))) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString(),
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSession(email: string) {
  const c = await cookies();
  c.set(COOKIE, buildToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(TTL_MS / 1000),
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  return verifyToken(c.get(COOKIE)?.value);
}

export async function clearSession() {
  const c = await cookies();
  c.delete(COOKIE);
}
