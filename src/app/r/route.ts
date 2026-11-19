import { NextResponse, after, type NextRequest } from "next/server";
import { sql } from "@/lib/db";
import { classifyAgent, ensureTrackingTables, verifyTracked } from "@/lib/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Enlace medido de los correos: /r?u=<destino>&c=<campaña>&s=<suscriptor>&k=<firma>
 * Registra el clic y redirige al destino. La firma impide usarlo para redirigir a
 * cualquier sitio: si no cuadra, se manda a la portada.
 */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const url = p.get("u") ?? "";
  const campaign = p.get("c") ?? "";
  const sid = p.get("s") ?? "";
  const k = p.get("k") ?? "";

  if (!/^https?:\/\//i.test(url) || !campaign || !k || !verifyTracked(url, campaign, sid, k)) {
    return NextResponse.redirect("https://juanandresromero.es", 302);
  }

  const bot = classifyAgent(req.headers.get("user-agent"));
  const subscriberId = /^\d+$/.test(sid) ? Number(sid) : null;
  // El registro va después de responder: el clic no espera a la base de datos.
  after(async () => {
    try {
      await ensureTrackingTables();
      await sql`
        INSERT INTO email_clicks (campaign, url, subscriber_id, bot)
        VALUES (${campaign.slice(0, 120)}, ${url.slice(0, 1000)}, ${subscriberId}, ${bot})
      `;
    } catch (err) {
      console.error("[tracking] clic no registrado", err);
    }
  });

  return NextResponse.redirect(url, 302);
}
