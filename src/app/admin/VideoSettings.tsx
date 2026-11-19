"use client";

import { useActionState, useState } from "react";
import { saveVideoSettings, type VideoSettingsState } from "@/app/actions/admin-newsletter";

/* «Vídeo exclusivo» del panel: pegar el enlace de YouTube (subido como «Oculto»)
   que verán los suscriptores en /video. */
export default function VideoSettings({ current }: { current: { id: string; title: string } }) {
  const [state, action, pending] = useActionState<VideoSettingsState, FormData>(saveVideoSettings, { ok: false });
  const [url, setUrl] = useState(`https://youtu.be/${current.id}`);
  const [title, setTitle] = useState(current.title);

  return (
    <section className="vs">
      <h2 className="vs__h2">Vídeo exclusivo</h2>
      <p className="vs__muted">
        Es el vídeo que ven los suscriptores en <a href="/video" target="_blank">juanandresromero.es/video</a>.
        Súbelo a YouTube como <strong>Oculto</strong> (con «Permitir inserción» activado) y pega aquí su enlace.
        No compartas ese enlace de YouTube con nadie: en los correos usa <code>{"{enlace_video}"}</code>.
      </p>
      <form action={action} className="vs__row">
        <input name="url" className="vs__input" placeholder="https://youtu.be/…" value={url} onChange={(e) => setUrl(e.target.value)} required />
        <input name="title" className="vs__input" placeholder="Título que verán los suscriptores" value={title} maxLength={140} onChange={(e) => setTitle(e.target.value)} required />
        <button type="submit" className="vs__btn" disabled={pending}>{pending ? "Guardando…" : "Guardar vídeo"}</button>
      </form>
      {state.error && <p className="vs__error" role="alert">{state.error}</p>}
      {state.ok && <p className="vs__ok" role="status">Guardado: los suscriptores ya ven este vídeo en /video.</p>}
      <style jsx>{`
        .vs { margin-bottom: 3rem; padding: 1.5rem; border: 1px solid rgba(0,0,0,0.08); border-radius: var(--radius-md); background: var(--color-white); }
        .vs__h2 { font-family: var(--font-display); font-size: var(--fs-24); font-weight: 500; margin: 0 0 0.5rem; }
        .vs__muted { font-size: var(--fs-13); color: var(--fg-muted); margin: 0 0 1rem; line-height: 1.5; }
        .vs__row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .vs__input { flex: 1; min-width: 220px; padding: 0.75rem 1rem; border: 1px solid rgba(0,0,0,0.12); border-radius: var(--radius-sm); font-size: var(--fs-15); }
        .vs__btn { padding: 0.75rem 1.5rem; background: var(--color-ink); color: var(--color-white); border-radius: var(--radius-sm); font-size: var(--fs-14); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
        .vs__btn:disabled { opacity: 0.6; }
        .vs__error { color: #c0392b; font-size: var(--fs-13); margin: 0.75rem 0 0; }
        .vs__ok { color: #14855e; font-size: var(--fs-13); margin: 0.75rem 0 0; }
      `}</style>
    </section>
  );
}
