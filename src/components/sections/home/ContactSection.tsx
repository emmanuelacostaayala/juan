"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { images } from "@/lib/assets";
import { submitContact, type ContactState } from "@/app/actions/contact";

const TABS = ["Prensa", "Instituciones", "Colaboradores"] as const;
type Tab = (typeof TABS)[number];

const initialState: ContactState = { ok: false };

export default function ContactSection() {
  const [tab, setTab] = useState<Tab>("Prensa");
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  return (
    <section id="contacto" className="contacto">
      <div className="contacto__grid">
        <aside className="contacto__aside">
          <Image
            src={images.portraitSunset}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="contacto__aside-img"
            quality={90}
          />
          <div className="contacto__aside-overlay" aria-hidden="true" />
          <blockquote className="contacto__quote">
            <p>
              &ldquo;Lidero desde la integridad, la visión y la convicción de
              que los grandes sueños se construyen paso a paso, con valores y
              equipo.&rdquo;
            </p>
            <footer>Juan Andrés Romero</footer>
          </blockquote>
        </aside>

        <div className="contacto__form-wrap">
          <header className="contacto__head">
            <p className="uppercase-tag contacto__tag">Contacto</p>
            <h2 className="contacto__title">Colaboremos.</h2>
            <p className="contacto__sub">
              Cuéntame en qué estás trabajando — prensa, instituciones o
              colaboraciones, todo es bienvenido.
            </p>
          </header>

          <div role="tablist" aria-label="Tipo de contacto" className="contacto__tabs">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                className={`contacto__tab ${tab === t ? "is-active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {state.ok ? (
            <div className="contacto__success" role="status">
              <h3>Gracias{state.echo?.name ? `, ${state.echo.name}` : ""}.</h3>
              <p>
                Hemos recibido tu mensaje como{" "}
                <strong>{state.echo?.tab ?? tab}</strong>. Te respondemos lo
                antes posible.
              </p>
            </div>
          ) : (
            <form className="contacto__form" action={formAction} noValidate>
              <input type="hidden" name="tab" value={tab} />
              {/* honeypot for bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
              />

              <div className="field">
                <label htmlFor="c-name" className="field__label">Nombre</label>
                <input id="c-name" className="field__input" type="text" name="name" required />
              </div>
              <div className="field">
                <label htmlFor="c-email" className="field__label">Email</label>
                <input id="c-email" className="field__input" type="email" name="email" required />
              </div>
              <div className="field">
                <label htmlFor="c-phone" className="field__label">Teléfono</label>
                <input
                  id="c-phone"
                  className="field__input"
                  type="tel"
                  name="phone"
                  placeholder="+34"
                />
              </div>
              <div className="field">
                <label htmlFor="c-message" className="field__label">Mensaje</label>
                <textarea
                  id="c-message"
                  className="field__textarea"
                  name="message"
                  required
                />
              </div>
              <label className="contacto__check">
                <input type="checkbox" name="accept" required />
                <span>He leído y acepto la política de privacidad.</span>
              </label>

              {state.error && (
                <p className="contacto__error" role="alert">
                  {state.error}
                </p>
              )}

              <button type="submit" className="btn btn--dark contacto__submit" disabled={pending}>
                {pending ? "Enviando…" : "Enviar"}
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .contacto {
          background: var(--color-white);
          scroll-margin-top: 5rem;
        }
        .contacto__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 80vh;
        }
        .contacto__aside {
          position: relative;
          background: var(--color-black);
          color: var(--color-white);
          overflow: hidden;
          min-height: 500px;
        }
        .contacto__aside :global(.contacto__aside-img) {
          object-fit: cover;
          object-position: center;
          filter: saturate(0.95);
        }
        .contacto__aside-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.82) 100%);
          pointer-events: none;
        }
        .contacto__quote {
          position: absolute;
          bottom: 3rem;
          left: 3rem;
          right: 3rem;
          font-family: var(--font-serif);
          font-style: italic;
          font-size: var(--fs-20);
          line-height: 1.4;
          color: var(--color-white);
          max-width: 44ch;
        }
        .contacto__quote footer {
          margin-top: 1rem;
          font-family: var(--font-sans);
          font-style: normal;
          font-size: var(--fs-13);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
        }
        .contacto__form-wrap {
          padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 620px;
          width: 100%;
          margin: 0 auto;
        }
        .contacto__tag {
          color: var(--color-accent);
          margin-bottom: 1rem;
        }
        .contacto__title {
          font-size: clamp(var(--fs-36), 5vw, var(--fs-68));
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0 0 0.5rem;
        }
        .contacto__sub {
          font-size: var(--fs-15);
          color: var(--fg-muted);
          margin-bottom: 2rem;
        }
        .contacto__tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .contacto__tab {
          padding: 0.625rem 1rem;
          border-radius: var(--radius-pill);
          font-size: var(--fs-13);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--color-cream);
          color: var(--fg-muted);
          transition: all 180ms var(--ease-out);
        }
        .contacto__tab.is-active {
          background: var(--color-ink);
          color: var(--color-white);
        }
        .contacto__form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: relative;
        }
        .contacto__check {
          display: flex;
          gap: 0.625rem;
          align-items: flex-start;
          font-size: var(--fs-13);
          color: var(--fg-muted);
          line-height: 1.4;
          cursor: pointer;
        }
        .contacto__error {
          font-size: var(--fs-14);
          color: #c0392b;
          margin: 0;
        }
        .contacto__submit {
          align-self: flex-start;
          padding: 1rem 2rem;
          min-width: 180px;
        }
        .contacto__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .contacto__success {
          padding: 2rem 0;
        }
        .contacto__success h3 {
          font-size: clamp(var(--fs-30), 4vw, var(--fs-52));
          font-weight: 500;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        .contacto__success p {
          color: var(--fg-muted);
          font-size: var(--fs-18);
        }
        @media (max-width: 900px) {
          .contacto__grid {
            grid-template-columns: 1fr;
          }
          .contacto__aside {
            min-height: 320px;
          }
          .contacto__quote {
            font-size: var(--fs-18);
            bottom: 2rem;
            left: 1.5rem;
            right: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
