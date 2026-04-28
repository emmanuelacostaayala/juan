"use client";

import { useActionState } from "react";
import {
  publishNewsletter,
  type PublishState,
} from "@/app/actions/admin-newsletter";
import { logoutAdmin } from "@/app/actions/admin-auth";

const initial: PublishState = { ok: false };

type Post = {
  id: number;
  slug: string;
  title: string;
  sent_at: Date | null;
  recipients_count: number | null;
  created_at: Date;
};

export default function AdminDashboard({
  email,
  subscribers,
  posts,
}: {
  email: string;
  subscribers: number;
  posts: Post[];
}) {
  const [state, action, pending] = useActionState(publishNewsletter, initial);

  return (
    <div className="admin">
      <header className="admin__top">
        <div>
          <p className="admin__hello">Sesión: <strong>{email}</strong></p>
          <h1 className="admin__title">Newsletter</h1>
        </div>
        <form action={logoutAdmin}>
          <button className="admin__logout" type="submit">Cerrar sesión</button>
        </form>
      </header>

      <section className="admin__stats">
        <div className="admin__stat">
          <span className="admin__stat-num">{subscribers}</span>
          <span className="admin__stat-label">Suscriptores activos</span>
        </div>
        <div className="admin__stat">
          <span className="admin__stat-num">{posts.length}</span>
          <span className="admin__stat-label">Publicaciones totales</span>
        </div>
      </section>

      <section className="admin__compose">
        <h2 className="admin__h2">Nueva publicación</h2>
        <form action={action} className="admin__form">
          <label className="admin__label">
            <span>Título</span>
            <input
              name="title"
              type="text"
              required
              maxLength={140}
              placeholder="Reflexiones de marzo"
              className="admin__input"
            />
          </label>

          <label className="admin__label">
            <span>Contenido</span>
            <textarea
              name="body"
              required
              rows={14}
              placeholder="Escribe aquí. Líneas en blanco crean párrafos."
              className="admin__textarea"
            />
          </label>

          <label className="admin__check">
            <input type="checkbox" name="send" defaultChecked />
            <span>Enviar por email a los suscriptores activos ahora</span>
          </label>

          {state.error && <p className="admin__error" role="alert">{state.error}</p>}
          {state.ok && (
            <p className="admin__success" role="status">
              {state.recipients
                ? `Publicación creada y enviada a ${state.recipients} suscriptor(es).`
                : "Publicación guardada como borrador."}
            </p>
          )}

          <button type="submit" className="admin__submit" disabled={pending}>
            {pending ? "Publicando…" : "Publicar"}
          </button>
        </form>
      </section>

      <section className="admin__posts">
        <h2 className="admin__h2">Publicaciones</h2>
        {posts.length === 0 ? (
          <p className="admin__empty">Aún no has publicado nada.</p>
        ) : (
          <ul className="admin__list">
            {posts.map((p) => (
              <li key={p.id} className="admin__item">
                <div>
                  <p className="admin__item-title">{p.title}</p>
                  <p className="admin__item-meta">
                    {p.sent_at
                      ? `Enviado · ${new Date(p.sent_at).toLocaleString("es-ES")} · ${p.recipients_count ?? 0} destinatarios`
                      : `Borrador · ${new Date(p.created_at).toLocaleString("es-ES")}`}
                  </p>
                </div>
                <span className={`admin__badge ${p.sent_at ? "is-sent" : "is-draft"}`}>
                  {p.sent_at ? "Enviado" : "Borrador"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <style jsx>{`
        .admin {
          max-width: 880px;
          margin: 0 auto;
          padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem);
          color: var(--color-ink);
        }
        .admin__top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .admin__hello {
          font-size: var(--fs-13);
          color: var(--fg-muted);
          margin: 0 0 0.25rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .admin__title {
          font-family: var(--font-display);
          font-size: clamp(var(--fs-36), 5vw, var(--fs-52));
          font-weight: 500;
          letter-spacing: -0.03em;
          margin: 0;
        }
        .admin__logout {
          background: transparent;
          border: 1px solid rgba(0,0,0,0.15);
          padding: 0.5rem 0.875rem;
          border-radius: var(--radius-sm);
          font-size: var(--fs-13);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 180ms var(--ease-out);
        }
        .admin__logout:hover {
          background: rgba(0,0,0,0.05);
        }
        .admin__stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .admin__stat {
          padding: 1.25rem 1.5rem;
          background: var(--color-cream);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .admin__stat-num {
          font-family: var(--font-display);
          font-size: var(--fs-44);
          font-weight: 500;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .admin__stat-label {
          font-size: var(--fs-13);
          color: var(--fg-muted);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .admin__h2 {
          font-family: var(--font-display);
          font-size: var(--fs-24);
          font-weight: 500;
          margin: 0 0 1rem;
        }
        .admin__compose {
          margin-bottom: 3rem;
        }
        .admin__form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .admin__label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: var(--fs-13);
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .admin__input,
        .admin__textarea {
          padding: 0.875rem 1rem;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          font-size: var(--fs-15);
          background: var(--color-white);
          color: var(--color-ink);
          outline: none;
          transition: border-color 180ms var(--ease-out);
        }
        .admin__textarea {
          resize: vertical;
          line-height: 1.55;
          font-family: var(--font-sans);
        }
        .admin__input:focus,
        .admin__textarea:focus {
          border-color: var(--color-ink);
        }
        .admin__check {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          font-size: var(--fs-13);
          color: var(--fg-muted);
          cursor: pointer;
        }
        .admin__error { color: #c0392b; font-size: var(--fs-13); margin: 0; }
        .admin__success { color: #14855e; font-size: var(--fs-13); margin: 0; }
        .admin__submit {
          align-self: flex-start;
          padding: 1rem 2rem;
          background: var(--color-ink);
          color: var(--color-white);
          border-radius: var(--radius-sm);
          font-size: var(--fs-14);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .admin__submit:disabled { opacity: 0.6; }
        .admin__list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .admin__item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: var(--radius-md);
          background: var(--color-white);
        }
        .admin__item-title {
          margin: 0;
          font-weight: 500;
          font-size: var(--fs-16);
        }
        .admin__item-meta {
          margin: 0.25rem 0 0;
          font-size: var(--fs-13);
          color: var(--fg-muted);
        }
        .admin__badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-pill);
        }
        .admin__badge.is-sent { background: #def4e8; color: #14855e; }
        .admin__badge.is-draft { background: #f1efeb; color: #888; }
        .admin__empty { color: var(--fg-muted); }
      `}</style>
    </div>
  );
}
