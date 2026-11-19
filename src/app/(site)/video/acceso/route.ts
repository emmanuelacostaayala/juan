import { NextResponse, type NextRequest } from "next/server";
import { subscriberFromToken, videoAccessToken, VIDEO_COOKIE, VIDEO_COOKIE_MAX_AGE } from "@/lib/video-access";

/* Enlace personal del email: si es de un suscriptor activo, deja la cookie y
   lleva al vídeo. Si no, lleva a /video, donde se pide suscribirse. */
export async function GET(req: NextRequest) {
  const url = new URL("/video", req.url);
  const email = await subscriberFromToken(req.nextUrl.searchParams.get("t"));
  const res = NextResponse.redirect(url);
  if (email) {
    res.cookies.set(VIDEO_COOKIE, videoAccessToken(email), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: VIDEO_COOKIE_MAX_AGE,
    });
  }
  return res;
}
