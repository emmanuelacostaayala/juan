import "server-only";

import { sql } from "@/lib/db";
import { presignGet, presignPut } from "@/lib/presign";

/*
 * Vídeo exclusivo guardado en Cloudflare R2 (archivo privado). Necesita estas
 * variables en Vercel (Settings → Environment Variables):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 * El archivo que se reproduce se elige subiéndolo desde /admin («Vídeo exclusivo»)
 * y se guarda en site_settings. Si no se ha subido ninguno, vale R2_VIDEO_KEY.
 * Sin R2 configurado, /video sigue usando YouTube.
 */

const EXPIRES_IN = 60 * 60 * 6; // 6 h: da para ver el vídeo entero; luego el enlace ya no sirve
const UPLOAD_EXPIRES_IN = 60 * 60 * 3; // 3 h para subir un archivo grande

type R2 = { accountId: string; accessKeyId: string; secretAccessKey: string; bucket: string };

export function r2Config(): R2 | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET?.trim();
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

function sign(c: R2, key: string, method: "GET" | "PUT", expiresIn: number): string {
  const opts = {
    host: `${c.accountId}.r2.cloudflarestorage.com`,
    path: `/${c.bucket}/${key.replace(/^\/+/, "")}`,
    accessKeyId: c.accessKeyId,
    secretAccessKey: c.secretAccessKey,
    region: "auto",
    expiresIn,
  };
  return method === "GET" ? presignGet(opts) : presignPut(opts);
}

/* ── Vídeo elegido en el panel ─────────────────────────────────────────── */

export type StoredVideo = { key: string; title: string | null; size: number | null; uploadedAt: string | null };

const K_KEY = "video_key";
const K_TITLE = "video_title";
const K_SIZE = "video_size";
const K_AT = "video_uploaded_at";

export async function getStoredVideo(): Promise<StoredVideo | null> {
  try {
    const rows = await sql<{ key: string; value: string }[]>`
      SELECT key, value FROM site_settings WHERE key IN (${K_KEY}, ${K_TITLE}, ${K_SIZE}, ${K_AT})
    `;
    const m = new Map(rows.map((r) => [r.key, r.value]));
    const key = m.get(K_KEY)?.trim();
    if (key) {
      return {
        key,
        title: m.get(K_TITLE)?.trim() || null,
        size: m.get(K_SIZE) ? Number(m.get(K_SIZE)) : null,
        uploadedAt: m.get(K_AT) || null,
      };
    }
  } catch {
    // site_settings aún no existe: se usa la variable de entorno
  }
  const envKey = process.env.R2_VIDEO_KEY?.trim();
  return envKey ? { key: envKey, title: null, size: null, uploadedAt: null } : null;
}

export async function saveStoredVideo(v: { key: string; title: string; size: number }): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  const at = new Date().toISOString();
  await sql`
    INSERT INTO site_settings (key, value, updated_at) VALUES
      (${K_KEY}, ${v.key}, now()),
      (${K_TITLE}, ${v.title}, now()),
      (${K_SIZE}, ${String(v.size)}, now()),
      (${K_AT}, ${at}, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}

/* Enlace temporal para reproducir el vídeo elegido (null si no hay R2 o vídeo). */
export async function r2VideoUrl(): Promise<string | null> {
  const c = r2Config();
  if (!c) return null;
  const v = await getStoredVideo();
  return v ? sign(c, v.key, "GET", EXPIRES_IN) : null;
}

/* Enlace temporal para subir un vídeo nuevo desde el panel. */
export function r2UploadUrl(key: string): string | null {
  const c = r2Config();
  return c ? sign(c, key, "PUT", UPLOAD_EXPIRES_IN) : null;
}
