"use client";

import Link from "next/link";

export default function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="legal">
      <div className="container legal__inner">
        <Link href="/" className="legal__back">
          ← Volver al inicio
        </Link>
        <header className="legal__head">
          <h1 className="legal__title">{title}</h1>
          <p className="legal__updated">Última actualización: {lastUpdated}</p>
        </header>
        <div className="legal__body">{children}</div>
      </div>

      <style jsx>{`
        .legal {
          padding-block: clamp(6rem, 12vw, 9rem) clamp(4rem, 9vw, 7rem);
          background: var(--color-cream);
          min-height: 80vh;
        }
        .legal__inner {
          max-width: 760px;
        }
        :global(.legal__back) {
          display: inline-block;
          margin-bottom: 2.5rem;
          font-size: var(--fs-13);
          color: var(--fg-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 180ms var(--ease-out);
        }
        :global(.legal__back:hover) {
          color: var(--color-ink);
        }
        .legal__head {
          margin-bottom: clamp(2rem, 4vw, 3rem);
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        .legal__title {
          font-family: var(--font-display);
          font-size: clamp(var(--fs-36), 5vw, var(--fs-68));
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0 0 0.75rem;
          color: var(--color-ink);
        }
        .legal__updated {
          font-size: var(--fs-13);
          color: var(--fg-muted);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .legal__body {
          font-size: var(--fs-16);
          line-height: 1.7;
          color: var(--color-ink);
        }
        .legal__body :global(h2) {
          font-family: var(--font-display);
          font-size: clamp(var(--fs-22), 2.4vw, var(--fs-30));
          font-weight: 500;
          letter-spacing: -0.02em;
          margin: 2.5rem 0 1rem;
          color: var(--color-ink);
        }
        .legal__body :global(h3) {
          font-size: var(--fs-18);
          font-weight: 600;
          margin: 1.75rem 0 0.5rem;
          color: var(--color-ink);
        }
        .legal__body :global(p) {
          margin: 0 0 1rem;
          color: rgba(0, 0, 0, 0.75);
        }
        .legal__body :global(ul) {
          margin: 0 0 1rem 1.25rem;
          padding-left: 0.5rem;
        }
        .legal__body :global(li) {
          margin-bottom: 0.5rem;
          color: rgba(0, 0, 0, 0.75);
        }
        .legal__body :global(a) {
          color: var(--color-accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .legal__body :global(a:hover) {
          opacity: 0.75;
        }
        .legal__body :global(strong) {
          color: var(--color-ink);
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}
