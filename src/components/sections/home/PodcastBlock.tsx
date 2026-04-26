"use client";

import { Reveal } from "@/lib/motion";

const YOUTUBE_URL = "https://youtube.com/@proximamentepodcast?si=zrACi4EgJD7SAwlH";

export default function PodcastBlock() {
  return (
    <section id="podcast" className="podcast">
      <div className="container podcast__inner">
        <Reveal>
          <p className="uppercase-tag podcast__tag">Podcast</p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="podcast__title">
            Próximamente.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="podcast__lead">
            Conversaciones sobre arquitectura, empresa y la construcción de
            legado. Voces que están dando forma al territorio y a las
            ciudades del mañana.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="podcast__cta"
          >
            <span>Ver en YouTube</span>
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 13L13 5M13 5H6M13 5V12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </Reveal>
      </div>

      <style jsx>{`
        .podcast {
          background: var(--color-ink);
          color: var(--color-white);
          padding-block: clamp(4rem, 9vw, 7rem);
          scroll-margin-top: 5rem;
          position: relative;
          overflow: hidden;
        }
        .podcast::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(60% 60% at 80% 30%, rgba(12, 175, 254, 0.18) 0%, transparent 60%),
            radial-gradient(50% 60% at 15% 80%, rgba(6, 120, 255, 0.14) 0%, transparent 65%);
          pointer-events: none;
        }
        .podcast__inner {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 760px;
          gap: 1.25rem;
        }
        .podcast__tag {
          color: var(--color-accent);
        }
        .podcast__title {
          font-family: var(--font-display);
          font-size: clamp(var(--fs-44), 8vw, 6.5rem);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.95;
          margin: 0;
          color: var(--color-white);
        }
        .podcast__lead {
          font-size: var(--fs-18);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.78);
          max-width: 56ch;
          margin: 0;
        }
        .podcast__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 1rem;
          padding: 1rem 1.5rem;
          background: var(--color-white);
          color: var(--color-ink);
          border-radius: var(--radius-pill);
          font-size: var(--fs-14);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: transform 220ms var(--ease-out), background 220ms var(--ease-out);
        }
        .podcast__cta:hover {
          transform: translateY(-2px);
          background: var(--color-cream);
        }
      `}</style>
    </section>
  );
}
