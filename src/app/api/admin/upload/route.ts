import { NextResponse, type NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: `Tipo no permitido (${file.type}). Solo imágenes.` },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Imagen demasiado grande (max 5 MB).` },
      { status: 400 },
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Almacenamiento no configurado. Activa Vercel Blob en el proyecto." },
      { status: 500 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeBase = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60) || "image";
  const path = `newsletter/${Date.now()}-${safeBase}.${ext}`;

  try {
    const blob = await put(path, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url, path: blob.pathname });
  } catch (err) {
    console.error("[upload] blob error", err);
    return NextResponse.json({ error: "Error al subir la imagen." }, { status: 500 });
  }
}
