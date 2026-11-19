"use client";

import { useRef, useState } from "react";

/*
 * «Vídeo exclusivo» del panel: sube un vídeo y lo deja como el que ven los
 * suscriptores en /video. El archivo va directo del navegador a R2.
 */

export type CurrentVideo = {
  configured: boolean;
  title: string | null;
  size: number | null;
  uploadedAt: string | null;
  source: "r2" | "youtube";
};

function mb(n: number) {
  return n >= 1024 ** 3 ? `${(n / 1024 ** 3).toFixed(2)} GB` : `${Math.round(n / 1024 ** 2)} MB`;
}

export default function VideoUploader({ current }: { current: CurrentVideo }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(current.title ?? "");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  async function api(body: object) {
    const res = await fetch("/api/admin/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error ?? "Error inesperado.");
    return j;
  }

  async function upload() {
    if (!file) return;
    if (!title.trim()) return setError("Pon un título al vídeo.");
    setError(null);
    setDone(false);
    try {
      const contentType = file.type || "video/mp4";
      const { key, url } = await api({ action: "start", filename: file.name, contentType, size: file.size });
      setProgress(0);
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100));
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`El almacenamiento rechazó la subida (${xhr.status}).`));
        xhr.onerror = () =>
          reject(new Error("No se pudo conectar con el almacenamiento. Revisa la conexión o la configuración CORS del bucket."));
        xhr.onabort = () => reject(new Error("Subida cancelada."));
        xhr.send(file);
      });
      await api({ action: "done", key, title: title.trim(), size: file.size });
      setDone(true);
      setFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado.");
    } finally {
      setProgress(null);
      xhrRef.current = null;
    }
  }

  const uploading = progress !== null;

  return (
    <section className="vu">
      <h2 className="vu__h2">Vídeo exclusivo</h2>
      <p className="vu__muted">
        Es el vídeo que ven los suscriptores en <a href="/video" target="_blank">juanandresromero.es/video</a>.
        En los correos, escribe <code>{"{enlace_video}"}</code> y cada persona recibe su enlace personal.
      </p>

      {!current.configured ? (
        <p className="vu__warn">
          Falta conectar el almacenamiento de vídeos (Cloudflare R2). Hasta entonces se sigue usando el vídeo de YouTube.
        </p>
      ) : (
        <>
          <p className="vu__now">
            Ahora mismo:{" "}
            {current.source === "r2" ? (
              <strong>
                {current.title ?? "vídeo subido"}
                {current.size ? ` · ${mb(current.size)}` : ""}
                {current.uploadedAt ? ` · subido el ${new Date(current.uploadedAt).toLocaleString("es-ES")}` : ""}
              </strong>
            ) : (
              <strong>el vídeo de YouTube (aún no has subido ninguno)</strong>
            )}
          </p>

          <div className="vu__row">
            <label className="vu__file">
              {file ? `${file.name} · ${mb(file.size)}` : "Elegir vídeo (MP4, MOV o WEBM)"}
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
                hidden
                disabled={uploading}
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  setDone(false);
                  setError(null);
                }}
              />
            </label>
            <input
              className="vu__input"
              placeholder="Título que verán los suscriptores"
              value={title}
              maxLength={140}
              disabled={uploading}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {uploading ? (
            <div className="vu__progress">
              <div className="vu__bar"><span style={{ width: `${progress}%` }} /></div>
              <span>{progress} % · no cierres esta pestaña</span>
              <button type="button" className="vu__link" onClick={() => xhrRef.current?.abort()}>Cancelar</button>
            </div>
          ) : (
            <button type="button" className="vu__btn" disabled={!file} onClick={upload}>
              Subir y usar este vídeo
            </button>
          )}

          {error && <p className="vu__error" role="alert">{error}</p>}
          {done && (
            <p className="vu__ok" role="status">
              Listo: los suscriptores ya ven este vídeo en /video. Recarga la página para ver el estado.
            </p>
          )}
        </>
      )}

      <style jsx>{`
        .vu { margin-bottom: 3rem; padding: 1.5rem; border: 1px solid rgba(0,0,0,0.08); border-radius: var(--radius-md); background: var(--color-white); }
        .vu__h2 { font-family: var(--font-display); font-size: var(--fs-24); font-weight: 500; margin: 0 0 0.5rem; }
        .vu__muted, .vu__now { font-size: var(--fs-13); color: var(--fg-muted); margin: 0 0 1rem; }
        .vu__now strong { color: var(--color-ink); font-weight: 500; }
        .vu__warn { font-size: var(--fs-13); background: #fff7e0; border: 1px solid #f0e0a8; padding: 0.75rem 1rem; border-radius: var(--radius-sm); }
        .vu__row { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .vu__file { display: inline-flex; align-items: center; padding: 0.75rem 1rem; background: var(--color-cream); border: 1px solid rgba(0,0,0,0.08); border-radius: var(--radius-sm); font-size: var(--fs-13); cursor: pointer; }
        .vu__input { flex: 1; min-width: 240px; padding: 0.75rem 1rem; border: 1px solid rgba(0,0,0,0.12); border-radius: var(--radius-sm); font-size: var(--fs-15); }
        .vu__btn { padding: 0.875rem 1.5rem; background: var(--color-ink); color: var(--color-white); border-radius: var(--radius-sm); font-size: var(--fs-14); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
        .vu__btn:disabled { opacity: 0.5; }
        .vu__progress { display: flex; align-items: center; gap: 0.75rem; font-size: var(--fs-13); }
        .vu__bar { flex: 1; height: 8px; background: rgba(0,0,0,0.08); border-radius: 4px; overflow: hidden; }
        .vu__bar span { display: block; height: 100%; background: var(--color-ink); transition: width 200ms; }
        .vu__link { background: none; border: none; color: #c0392b; text-decoration: underline; cursor: pointer; font-size: var(--fs-13); }
        .vu__error { color: #c0392b; font-size: var(--fs-13); margin: 0.75rem 0 0; }
        .vu__ok { color: #14855e; font-size: var(--fs-13); margin: 0.75rem 0 0; }
      `}</style>
    </section>
  );
}
