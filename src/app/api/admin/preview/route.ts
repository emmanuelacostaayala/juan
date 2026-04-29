import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { renderNewsletterEmail } from "@/lib/newsletter-template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: { title?: string; body?: string; coverImageUrl?: string | null };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const title = String(payload.title ?? "").trim() || "Sin título";
  const body = String(payload.body ?? "").trim() || "_(vacío)_";
  const coverImageUrl = payload.coverImageUrl?.trim() || null;

  const { html } = renderNewsletterEmail({
    title,
    body,
    unsubscribeUrl: "https://juanandresromero.es/unsubscribe",
    coverImageUrl,
  });

  return NextResponse.json({ html });
}
