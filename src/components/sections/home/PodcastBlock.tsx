"use client";

import { Reveal } from "@/lib/motion";

const YOUTUBE_URL = "https://youtube.com/@proximamentepodcast?si=zrACi4EgJD7SAwlH";
const SPOTIFY_URL = "https://open.spotify.com/show/1zrGBdSh888eF5xV2SOl8D?si=XtSbwc77SmeKh_Cx4VEKIg";
const SPOTIFY_EMBED = "https://open.spotify.com/embed/show/1zrGBdSh888eF5xV2SOl8D?utm_source=generator&theme=0";

function ArrowOut() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
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
  );
}

export default function PodcastBlock() {
  return (
    <section id="podcast" className="podcast">
      <div className="container podcast__grid">
        <div className="podcast__copy">
          <Reveal>
            <p className="uppercase-tag podcast__tag">Podcast</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="podcast__title">Próximamente.</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="podcast__lead">
              Conversaciones sobre arquitectura, empresa y la construcción de
              legado. Voces que están dando forma al territorio y a las
              ciudades del mañana.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="podcast__ctas">
              <a
                href={SPOTIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="podcast__cta podcast__cta--spotify"
              >
                <span>Escuchar en Spotify</span>
                <ArrowOut />
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="podcast__cta podcast__cta--ghost"
              >
                <span>Ver en YouTube</span>
                <ArrowOut />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="podcast__embed-wrap">
          <iframe
            title="Próximamente Podcast en Spotify — últimos episodios"
            src={SPOTIFY_EMBED}
            width="100%"
            height="420"
            frameBorder={0}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="podcast__embed"
          />
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
        .podcast__grid {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
        }
        .podcast__copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.25rem;
        }
        .podcast__tag {
          color: var(--color-accent);
        }
        .podcast__title {
          font-family: var(--font-display);
          font-size: clamp(var(--fs-44), 6.5vw, 5.5rem);
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
          max-width: 52ch;
          margin: 0;
        }
        .podcast__ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .podcast__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.95rem 1.4rem;
          border-radius: var(--radius-pill);
          font-size: var(--fs-14);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: transform 220ms var(--ease-out), background 220ms var(--ease-out), color 220ms var(--ease-out);
        }
        .podcast__cta--spotify {
          background: #1DB954;
          color: #fff;
        }
        .podcast__cta--spotify:hover {
          transform: translateY(-2px);
          background: #1ed760;
        }
        .podcast__cta--ghost {
          background: transparent;
          color: var(--color-white);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }
        .podcast__cta--ghost:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }
        .podcast__embed-wrap {
          width: 100%;
        }
        .podcast__embed {
          display: block;
          width: 100%;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
        }
        @media (max-width: 900px) {
          .podcast__grid {
            grid-template-columns: 1fr;
          }
          .podcast__embed {
            min-height: 380px;
          }
        }
      `}</style>
    </section>
  );
}
