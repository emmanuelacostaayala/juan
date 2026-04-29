import { NextResponse, type NextRequest } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// RFC 8058: one-click POST endpoint. Mailbox providers send POST with no
// session — the token in the URL is the auth. Must NOT redirect.
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("t");
  if (!token) {
    return NextResponse.json({ error: "missing token" }, { status: 400 });
  }
  try {
    const result = await sql`
      UPDATE subscribers SET status = 'unsubscribed'
      WHERE unsubscribe_token = ${token}
      RETURNING id
    `;
    if (result.length === 0) {
      return NextResponse.json({ error: "invalid token" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[unsubscribe] error", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
