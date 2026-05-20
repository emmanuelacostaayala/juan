"use client";

import { Reveal } from "@/lib/motion";

type Social = {
  key: string;
  platform: string;
  handle: string;
  hook: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
  brand: string;
};

const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.05 1.8.25 2.2.42.6.23 1 .5 1.5 1s.8.9 1 1.5c.17.4.37 1 .42 2.2.07 1.2.07 1.6.07 4.8s0 3.6-.07 4.8c-.05 1.2-.25 1.8-.42 2.2-.23.6-.5 1-1 1.5s-.9.8-1.5 1c-.4.17-1 .37-2.2.42-1.2.07-1.6.07-4.8.07s-3.6 0-4.8-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.23-1-.5-1.5-1s-.8-.9-1-1.5c-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.8c.05-1.2.25-1.8.42-2.2.23-.6.5-1 1-1.5s.9-.8 1.5-1c.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.95c-3.14 0-3.51.01-4.75.07-1.15.05-1.77.25-2.18.41-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.36 1.03-.41 2.18-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.05 1.15.25 1.77.41 2.18.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.36 2.18.41 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c1.15-.05 1.77-.25 2.18-.41.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.36-1.03.41-2.18.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.05-1.15-.25-1.77-.41-2.18-.21-.55-.47-.94-.88-1.35-.41-.41-.8-.67-1.35-.88-.41-.16-1.03-.36-2.18-.41-1.24-.06-1.61-.07-4.75-.07zm0 3.32a4.53 4.53 0 1 1 0 9.06 4.53 4.53 0 0 1 0-9.06zm0 1.95a2.58 2.58 0 1 0 0 5.17 2.58 2.58 0 0 0 0-5.17zm5.77-2.16a1.06 1.06 0 1 1-2.12 0 1.06 1.06 0 0 1 2.12 0z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5C0 2.12 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.07 0h4.37v1.91h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.48 3.04 5.48 6.99V22h-4.55v-6.18c0-1.47-.03-3.37-2.05-3.37-2.06 0-2.37 1.61-2.37 3.27V22H7.29V8z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.4a8.16 8.16 0 0 0 4.77 1.52V6.49a4.85 4.85 0 0 1-1.84-.16z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.42 17.32a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.57-1.04 8.5-.59 11.66 1.34.36.22.47.69.25 1.03zm1.45-3.23a.94.94 0 0 1-1.29.31c-3.23-1.99-8.16-2.57-11.99-1.4a.94.94 0 1 1-.55-1.8c4.38-1.34 9.83-.69 13.52 1.6.44.27.58.85.31 1.29zm.13-3.36c-3.87-2.3-10.26-2.51-13.95-1.39a1.13 1.13 0 1 1-.66-2.16c4.25-1.29 11.3-1.04 15.75 1.6a1.13 1.13 0 1 1-1.14 1.95z" />
    </svg>
  ),
};

const SOCIALS: Social[] = [
  {
    key: "instagram",
    platform: "Instagram",
    handle: "@juanandres_clerhp",
    hook: "Decisiones de obra, viajes y vida fuera del despacho. El día a día detrás de Larimar City.",
    cta: "Síguelo",
    href: "https://www.instagram.com/juanandres_clerhp?igsh=MTI3emR1d2d0djNpcw%3D%3D&utm_source=qr",
    icon: ICONS.instagram,
    brand: "#E4405F",
  },
  {
    key: "linkedin",
    platform: "LinkedIn",
    handle: "Juan Andrés Romero Hernández",
    hook: "Tesis sobre real estate, arquitectura y empresa cotizada. Para quien decide a largo plazo.",
    cta: "Conecta",
    href: "https://www.linkedin.com/in/juan-andres-romero-hernandez?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    icon: ICONS.linkedin,
    brand: "#0A66C2",
  },
  {
    key: "youtube",
    platform: "YouTube",
    handle: "@proximamentepodcast",
    hook: "Entrevistas largas del podcast Próxima Mente y los recorridos mensuales por la obra de Larimar.",
    cta: "Suscríbete",
    href: "https://youtube.com/@proximamentepodcast?si=zrACi4EgJD7SAwlH",
    icon: ICONS.youtube,
    brand: "#FF0000",
  },
  {
    key: "spotify",
    platform: "Spotify",
    handle: "Próxima Mente Podcast",
    hook: "Las conversaciones del podcast — empresa, arquitectura, liderazgo y conversaciones improbables.",
    cta: "Escúchalo",
    href: "https://open.spotify.com/show/1zrGBdSh888eF5xV2SOl8D?si=XtSbwc77SmeKh_Cx4VEKIg",
    icon: ICONS.spotify,
    brand: "#1DB954",
  },
  {
    key: "tiktok",
    platform: "TikTok",
    handle: "@proximamentepodcast",
    hook: "Cortes en vertical de las mejores ideas del podcast y reflexiones rápidas desde República Dominicana.",
    cta: "Síguelo",
    href: "https://www.tiktok.com/@proximamentepodcast?_r=1&_t=ZS-95mW9C1Yw5s",
    icon: ICONS.tiktok,
    brand: "#00F2EA",
  },
  {
    key: "x",
    platform: "X",
    handle: "@ceo_clerhp",
    hook: "Opinión inmediata sobre el mercado, el proyecto y la actualidad económica. Sin filtros corporativos.",
    cta: "Síguelo en X",
    href: "https://x.com/ceo_clerhp?s=21",
    icon: ICONS.x,
    brand: "#FFFFFF",
  },
];

export default function SocialBlock() {
  return (
    <section id="redes" className="socials section--deep">
      <div className="container">
        <Reveal>
          <header className="socials__head">
            <p className="uppercase-tag socials__tag">Redes sociales</p>
            <h2 className="socials__title">
              Síguelo donde<br />pasan las cosas.
            </h2>
            <p className="socials__sub">
              Cada canal tiene un propósito distinto. Elige el formato que
              prefieras y únete a la conversación.
            </p>
          </header>
        </Reveal>

        <ul className="socials__grid">
          {SOCIALS.map((s, i) => (
            <Reveal key={s.key} delay={0.04 * i}>
              <li className="socials__card">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="socials__link"
                  aria-label={`${s.cta} en ${s.platform}: ${s.handle}`}
                >
                  <span className="socials__icon" style={{ color: s.brand }}>
                    {s.icon}
                  </span>
                  <span className="socials__platform">{s.platform}</span>
                  <span className="socials__handle">{s.handle}</span>
                  <p className="socials__hook">{s.hook}</p>
                  <span className="socials__cta">
                    {s.cta}
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                      <path
                        d="M5 12h14m-5-5 5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .socials {
          padding-block: var(--section-y);
          scroll-margin-top: 5rem;
        }
        .socials__head {
          max-width: 680px;
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }
        .socials__tag {
          color: #0CAFFE;
          margin-bottom: 1rem;
        }
        .socials__title {
          font-size: clamp(var(--fs-36), 6vw, var(--fs-68));
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.95;
          margin: 0 0 1.5rem;
          color: var(--color-white);
        }
        .socials__sub {
          font-size: var(--fs-18);
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.55;
          max-width: 56ch;
        }
        .socials__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .socials__card {
          display: flex;
        }
        .socials__link {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
          padding: 1.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.02);
          color: inherit;
          text-decoration: none;
          transition: background 220ms var(--ease-out),
            border-color 220ms var(--ease-out),
            transform 220ms var(--ease-out);
        }
        .socials__link:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.22);
          transform: translateY(-4px);
        }
        .socials__icon {
          display: inline-flex;
          margin-bottom: 0.5rem;
        }
        .socials__platform {
          font-size: var(--fs-20);
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--color-white);
        }
        .socials__handle {
          font-size: var(--fs-13);
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.55);
          margin-bottom: 0.5rem;
        }
        .socials__hook {
          font-size: var(--fs-15);
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 1.25rem;
          flex: 1;
        }
        .socials__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          align-self: flex-start;
          padding: 0.6rem 1rem;
          font-size: var(--fs-13);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-ink);
          background: var(--color-white);
          border-radius: var(--radius-pill);
          transition: background 200ms var(--ease-out), gap 200ms var(--ease-out);
        }
        .socials__link:hover .socials__cta {
          gap: 0.75rem;
        }

        @media (max-width: 900px) {
          .socials__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 560px) {
          .socials__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
