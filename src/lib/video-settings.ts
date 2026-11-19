import "server-only";

import { sql } from "@/lib/db";
import { EXCLUSIVE_VIDEO, type ExclusiveVideo } from "@/lib/video";

/*
 * Vídeo exclusivo elegido desde /admin («Vídeo exclusivo»): basta con pegar el
 * enlace de YouTube. Se guarda en site_settings; si no hay nada guardado se usa
 * EXCLUSIVE_VIDEO de lib/video.ts.
 */

const K_ID = "yt_video_id";
const K_TITLE = "yt_video_title";

export async function getExclusiveVideo(): Promise<ExclusiveVideo> {
  try {
    const rows = await sql<{ key: string; value: string }[]>`
      SELECT key, value FROM site_settings WHERE key IN (${K_ID}, ${K_TITLE})
    `;
    const m = new Map(rows.map((r) => [r.key, r.value]));
    const id = m.get(K_ID)?.trim();
    if (id) return { provider: "youtube", id, title: m.get(K_TITLE)?.trim() || EXCLUSIVE_VIDEO.title };
  } catch {
    // site_settings aún no existe: valor por defecto
  }
  return EXCLUSIVE_VIDEO;
}

/* Saca el identificador de cualquier enlace de YouTube (youtu.be/…, watch?v=…,
   shorts/…, embed/…, studio…/video/…) o del identificador suelto. */
export function youtubeIdFrom(input: string): string | null {
  const s = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m =
    s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ||
    s.match(/[?&]v=([A-Za-z0-9_-]{11})/) ||
    s.match(/youtube(?:-nocookie)?\.com\/(?:embed|shorts|live|video)\/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export async function saveExclusiveVideo(id: string, title: string): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${K_ID}, ${id}, now()), (${K_TITLE}, ${title}, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}
