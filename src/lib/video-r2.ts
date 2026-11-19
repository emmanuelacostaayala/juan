import "server-only";

import { presignGet } from "@/lib/presign";

/*
 * Vídeo exclusivo guardado en Cloudflare R2 (archivo privado). Se activa solo si
 * están estas variables en Vercel (Settings → Environment Variables):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_VIDEO_KEY
 * (R2_VIDEO_KEY = nombre del archivo en el bucket, p. ej. mesa-redonda.mp4).
 * Si falta alguna, /video sigue usando YouTube.
 */

const EXPIRES_IN = 60 * 60 * 6; // 6 h: da para ver el vídeo entero; luego el enlace ya no sirve

export function r2VideoUrl(): string | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET?.trim();
  const key = process.env.R2_VIDEO_KEY?.trim();
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !key) return null;
  return presignGet({
    host: `${accountId}.r2.cloudflarestorage.com`,
    path: `/${bucket}/${key.replace(/^\/+/, "")}`,
    accessKeyId,
    secretAccessKey,
    region: "auto",
    expiresIn: EXPIRES_IN,
  });
}
