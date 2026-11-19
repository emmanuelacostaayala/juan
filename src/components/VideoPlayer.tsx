"use client";

/* Reproductor del vídeo de R2: sin botón de descarga ni menú del botón derecho. */
export default function VideoPlayer({ src, title }: { src: string; title: string }) {
  return (
    <video
      src={src}
      title={title}
      controls
      playsInline
      preload="metadata"
      controlsList="nodownload noplaybackrate"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#000" }}
    />
  );
}
