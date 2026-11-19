import type { Metadata } from "next";
import VideoGate from "@/components/VideoGate";
import VideoPlayer from "@/components/VideoPlayer";
import { r2VideoUrl } from "@/lib/video-r2";
import { currentVideoViewer } from "@/lib/video-access";
import { embedUrl, thumbnailUrl } from "@/lib/video";
import { getExclusiveVideo } from "@/lib/video-settings";

/*
 * Vídeo exclusivo para suscriptores. Se ve solo con acceso (enlace personal del
 * email o suscribiéndose aquí). Sin acceso, se pide suscribirse: si alguien pasa
 * el enlace, quien lo recibe tiene que apuntarse a la newsletter para verlo.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Vídeo exclusivo · Juan Andrés Romero" },
  description: "Contenido exclusivo para suscriptores de la newsletter de Juan Andrés Romero.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Vídeo exclusivo para suscriptores · Juan Andrés Romero",
    description: "Suscríbete a la newsletter para verlo.",
    url: "/video",
    images: [{ url: "/brand/newsletter-og.png", width: 1200, height: 630, alt: "Juan Andrés Romero · Newsletter" }],
  },
};

export default async function VideoPage() {
  const viewer = await currentVideoViewer();
  const v = await getExclusiveVideo();
  // Con R2 configurado, el vídeo sale de ahí con un enlace que caduca; si no, de YouTube.
  const r2 = viewer ? r2VideoUrl() : null;

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-ink)", color: "var(--color-white)", display: "flex", alignItems: "center", padding: "8rem 0 5rem" }}>
      <div className="container" style={{ width: "100%" }}>
        {viewer ? (
          <div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "var(--fs-13)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Contenido exclusivo para suscriptores
            </p>
            <h1 style={{ fontSize: "clamp(var(--fs-28), 3vw, 2.75rem)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "2rem" }}>
              {v.title}
            </h1>
            <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "var(--radius-md)", overflow: "hidden", background: "#000" }}>
              {r2 ? (
                <VideoPlayer src={r2} title={v.title} />
              ) : (
                <iframe
                  src={embedUrl(v)}
                  title={v.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </div>
            <p style={{ marginTop: "1rem", fontSize: "var(--fs-13)", color: "rgba(255,255,255,0.4)" }}>
              Acceso personal de {viewer}. Por favor, no compartas este enlace.
            </p>
          </div>
        ) : (
          <VideoGate title={v.title} thumbnail={thumbnailUrl(v)} />
        )}
      </div>
    </main>
  );
}
