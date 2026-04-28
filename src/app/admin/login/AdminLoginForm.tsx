"use client";

import { useActionState, useState } from "react";
import {
  requestAdminCode,
  verifyAdminCode,
  type RequestState,
  type VerifyState,
} from "@/app/actions/admin-auth";

const requestInitial: RequestState = { ok: false };
const verifyInitial: VerifyState = { ok: false };

export default function AdminLoginForm() {
  const [reqState, reqAction, reqPending] = useActionState(requestAdminCode, requestInitial);
  const [vrfState, vrfAction, vrfPending] = useActionState(verifyAdminCode, verifyInitial);
  const [email, setEmail] = useState("");

  const sentEmail = reqState.sent ? reqState.email ?? email : null;

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">Panel</h1>
        <p className="admin-login__sub">
          {sentEmail
            ? `Te hemos enviado un código a ${sentEmail}.`
            : "Inicia sesión con tu correo de administración."}
        </p>

        {!sentEmail ? (
          <form action={reqAction} className="admin-login__form">
            <label className="admin-login__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="admin-login__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marketing@juanandresromero.es"
            />
            {reqState.error && <p className="admin-login__error">{reqState.error}</p>}
            <button type="submit" className="admin-login__btn" disabled={reqPending}>
              {reqPending ? "Enviando…" : "Enviar código"}
            </button>
          </form>
        ) : (
          <form action={vrfAction} className="admin-login__form">
            <input type="hidden" name="email" value={sentEmail} />
            <label className="admin-login__label" htmlFor="code">
              Código de 6 dígitos
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              autoComplete="one-time-code"
              required
              className="admin-login__input admin-login__input--code"
              placeholder="••••••"
            />
            {vrfState.error && <p className="admin-login__error">{vrfState.error}</p>}
            <button type="submit" className="admin-login__btn" disabled={vrfPending}>
              {vrfPending ? "Verificando…" : "Entrar"}
            </button>
            <button
              type="button"
              className="admin-login__link"
              onClick={() => window.location.reload()}
            >
              Usar otro email
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .admin-login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-cream);
          padding: 2rem 1rem;
        }
        .admin-login__card {
          width: 100%;
          max-width: 420px;
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: clamp(1.75rem, 4vw, 2.5rem);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06);
        }
        .admin-login__title {
          font-family: var(--font-display);
          font-size: var(--fs-36);
          font-weight: 500;
          letter-spacing: -0.03em;
          margin: 0 0 0.5rem;
          color: var(--color-ink);
        }
        .admin-login__sub {
          color: var(--fg-muted);
          font-size: var(--fs-15);
          margin: 0 0 1.75rem;
        }
        .admin-login__form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .admin-login__label {
          font-size: var(--fs-13);
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--color-ink);
        }
        .admin-login__input {
          padding: 0.875rem 1rem;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          font-size: var(--fs-15);
          background: var(--color-white);
          color: var(--color-ink);
          outline: none;
          transition: border-color 180ms var(--ease-out);
        }
        .admin-login__input:focus {
          border-color: var(--color-ink);
        }
        .admin-login__input--code {
          font-size: 22px;
          letter-spacing: 0.4em;
          text-align: center;
        }
        .admin-login__btn {
          margin-top: 0.5rem;
          padding: 0.95rem 1.25rem;
          background: var(--color-ink);
          color: var(--color-white);
          border-radius: var(--radius-sm);
          font-size: var(--fs-14);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: opacity 180ms var(--ease-out);
        }
        .admin-login__btn:disabled {
          opacity: 0.6;
        }
        .admin-login__link {
          margin-top: 0.25rem;
          font-size: var(--fs-13);
          color: var(--fg-muted);
          text-decoration: underline;
          text-underline-offset: 3px;
          background: transparent;
          align-self: flex-start;
        }
        .admin-login__error {
          font-size: var(--fs-13);
          color: #c0392b;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
