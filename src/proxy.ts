import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Runs on the Edge runtime — we can't use node:crypto here.
// Presence check on the cookie; pages re-validate the signature
// server-side and clear/redirect on failure.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }
  const token = req.cookies.get("admin_session")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
