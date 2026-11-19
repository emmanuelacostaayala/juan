"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { unlockVideo, type VideoGateState } from "@/app/actions/video";

const initial: VideoGateState = { ok: false };

/* Lo que ve quien llega a /video sin acceso: miniatura, aviso y formulario. */
export default function VideoGate({ title, thumbnail }: { title: string; thumbnail: string | null }) {
  const [state, action, pending] = useActionState(unlockVideo, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.unlocked) router.refresh();
  }, [state.unlocked, router]);

  return (
    <div className="vg">
      <div className="vg__thumb" aria-hidden="true">
        {thumbnail && <img src={thumbnail} alt="" />}
        <span className="vg__lock">Exclusivo para suscriptores</span>
      </div>

      <div className="vg__body">
        <p className="vg__tag">Contenido exclusivo</p>
        <h1 className="vg__title">{title}</h1>
        <p className="vg__desc">
          Este vídeo es solo para quienes reciben la newsletter de Juan Andrés Romero.
          Suscríbete y podrás verlo al momento.
        </p>

        {state.sent ? (
          <p className="vg__ok">
            Ya estás suscrito/a: te hemos enviado a tu correo tu enlace personal para ver el vídeo.
          </p>
        ) : state.unlocked ? (
          <p className="vg__ok">¡Listo! Cargando el vídeo…</p>
        ) : (
          <form className="vg__form" action={action} noValidate>
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
            />
            <input className="vg__input vg__input--half" name="name" placeholder="Nombre" required maxLength={80} autoComplete="given-name" aria-label="Nombre" />
            <input className="vg__input vg__input--half" name="lastName" placeholder="Apellidos (opcional)" maxLength={80} autoComplete="family-name" aria-label="Apellidos" />
            <input className="vg__input" type="email" name="email" placeholder="Tu correo electrónico" required aria-label="Correo electrónico" />
            <button type="submit" className="vg__btn" disabled={pending}>
              {pending ? "Un momento…" : "Suscribirme y ver el vídeo"}
            </button>
            {state.error && <p className="vg__error" role="alert">{state.error}</p>}
            <p className="vg__note">
              ¿Ya estás suscrito/a? Escribe tu correo y te enviamos tu enlace personal.
            </p>
          </form>
        )}
      </div>

      <style jsx>{`
        .vg { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: center; }
        .vg__thumb { position: relative; aspect-ratio: 16 / 9; border-radius: var(--radius-md); overflow: hidden; background: #000; }
        .vg__thumb img { width: 100%; height: 100%; object-fit: cover; filter: blur(6px) brightness(0.45); transform: scale(1.08); }
        .vg__lock {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-size: var(--fs-13); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #fff;
        }
        .vg__tag { color: rgba(255,255,255,0.45); font-size: var(--fs-13); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 1rem; }
        .vg__title { font-size: clamp(var(--fs-28), 3vw, var(--fs-44, 2.75rem)); font-weight: 500; letter-spacing: -0.04em; line-height: 1.05; margin-bottom: 1rem; text-wrap: balance; }
        .vg__desc { font-size: var(--fs-15); line-height: 1.6; color: rgba(255,255,255,0.6); max-width: 44ch; margin-bottom: 1.5rem; }
        .vg__form { display: flex; flex-wrap: wrap; gap: 0.75rem; position: relative; }
        .vg__input {
          flex: 1 1 100%; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--radius-sm); padding: 0.875rem 1.25rem; font-family: var(--font-sans);
          font-size: var(--fs-15); color: #fff; outline: none;
        }
        .vg__input--half { flex: 1 1 calc(50% - 0.375rem); }
        .vg__input::placeholder { color: rgba(255,255,255,0.35); }
        .vg__input:focus { border-color: rgba(255,255,255,0.4); }
        .vg__btn {
          flex: 1 1 100%; background: #fff; color: var(--color-ink); font-family: var(--font-sans);
          font-size: var(--fs-13); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: var(--radius-sm); padding: 0.95rem 1.5rem;
        }
        .vg__btn:disabled { opacity: 0.6; }
        .vg__error { flex-basis: 100%; font-size: var(--fs-13); color: #ff8e8e; margin: 0; }
        .vg__note { flex-basis: 100%; font-size: var(--fs-13); color: rgba(255,255,255,0.4); margin: 0.25rem 0 0; }
        .vg__ok { font-size: var(--fs-18); color: rgba(255,255,255,0.8); }
        @media (max-width: 860px) { .vg { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
