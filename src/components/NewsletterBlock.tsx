"use client";

import { useState } from "react";
import { Reveal } from "@/lib/motion";

export default function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="nl section">
      <div className="container nl__inner">
        <Reveal className="nl__copy">
          <p className="uppercase-tag nl__tag">Newsletter</p>
          <h2 className="nl__title">
            Suscríbete a la newsletter.
          </h2>
          <p className="nl__desc">
            Reflexiones sobre urbanismo, liderazgo y los avances de Larimar City.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="nl__form-wrap">
          {!submitted ? (
            <form
              className="nl__form"
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubmitted(true);
              }}
            >
              <input
                type="email"
                className="nl__input"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Correo electrónico"
              />
              <button type="submit" className="nl__btn">
                Suscribirme
              </button>
            </form>
          ) : (
            <p className="nl__success">Gracias — te escribiremos pronto.</p>
          )}
        </Reveal>
      </div>

      <style jsx>{`
        .nl {
          background: var(--color-ink);
          color: var(--color-white);
        }
        .nl__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 6vw, 5rem);
          align-items: center;
        }
        .nl__tag {
          color: rgba(255,255,255,0.45);
          margin-bottom: 1rem;
        }
        .nl__title {
          font-size: clamp(var(--fs-28), 3.5vw, var(--fs-52));
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1.0;
          margin-bottom: 1rem;
          text-wrap: balance;
        }
        .nl__desc {
          font-size: var(--fs-15);
          line-height: 1.6;
          color: rgba(255,255,255,0.55);
          max-width: 40ch;
        }
        .nl__form {
          display: flex;
          gap: 0.75rem;
        }
        .nl__input {
          flex: 1;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--radius-sm);
          padding: 0.875rem 1.25rem;
          font-family: var(--font-sans);
          font-size: var(--fs-15);
          color: var(--color-white);
          outline: none;
          transition: border-color 180ms var(--ease-out);
        }
        .nl__input::placeholder { color: rgba(255,255,255,0.35); }
        .nl__input:focus { border-color: rgba(255,255,255,0.4); }
        .nl__btn {
          background: var(--color-white);
          color: var(--color-ink);
          font-family: var(--font-sans);
          font-size: var(--fs-13);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: var(--radius-sm);
          padding: 0.875rem 1.5rem;
          white-space: nowrap;
          transition: opacity 180ms var(--ease-out);
        }
        .nl__btn:hover { opacity: 0.85; }
        .nl__success {
          font-size: var(--fs-18);
          color: rgba(255,255,255,0.75);
        }
        @media (max-width: 760px) {
          .nl__inner { grid-template-columns: 1fr; }
          .nl__form { flex-direction: column; }
          .nl__btn { text-align: center; }
        }
      `}</style>
    </section>
  );
}
