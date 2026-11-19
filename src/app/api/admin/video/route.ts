import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { r2Config, r2UploadUrl, saveStoredVideo } from "@/lib/video-r2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Subida del vídeo exclusivo desde /admin. El archivo NO pasa por nuestro
 * servidor (Vercel no admite archivos tan grandes): el navegador lo sube directo
 * a R2 con un enlace temporal que damos aquí.
 *   POST { action: "start", filename, contentType, size } → { key, url }
 *   POST { action: "done", key, title, size }            → guarda ese vídeo como el actual
 */

const TYPES = new Set(["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"]);
const MAX_BYTES = 5 * 1024 ** 3; // 5 GB: límite de una subida directa a R2

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Sesión expirada." }, { status: 401 });
  if (!r2Config()) {
    return NextResponse.json(
      { error: "Falta configurar el almacenamiento de vídeos (variables R2_* en Vercel)." },
      { status: 503 },
    );
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Petición no válida." }, { status: 400 });
  }

  if (b.action === "start") {
    const filename = String(b.filename ?? "video.mp4");
    const contentType = String(b.contentType ?? "");
    const size = Number(b.size ?? 0);
    if (!TYPES.has(contentType)) {
      return NextResponse.json({ error: "Formato no admitido. Sube un MP4, MOV o WEBM." }, { status: 400 });
    }
    if (!size || size > MAX_BYTES) {
      return NextResponse.json({ error: "El archivo pesa más de 5 GB. Expórtalo más comprimido." }, { status: 400 });
    }
    const key = `videos/${new Date().toISOString().slice(0, 10)}-${Date.now().toString(36)}-${slug(filename) || "video.mp4"}`;
    return NextResponse.json({ key, url: r2UploadUrl(key) });
  }

  if (b.action === "done") {
    const key = String(b.key ?? "");
    const title = String(b.title ?? "").trim().slice(0, 140);
    const size = Number(b.size ?? 0);
    if (!/^videos\/[a-z0-9.\-]+$/.test(key)) return NextResponse.json({ error: "Archivo no válido." }, { status: 400 });
    if (!title) return NextResponse.json({ error: "Pon un título al vídeo." }, { status: 400 });
    await saveStoredVideo({ key, title, size });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Acción desconocida." }, { status: 400 });
}
