import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Enlaces · Juan Andrés Romero",
  description:
    "Arquitecto. CEO de CLERHP. Creador de Larimar City & Resort. Anfitrión de Próxima Mente Podcast.",
  openGraph: {
    title: "Juan Andrés Romero",
    description:
      "Arquitecto. CEO de CLERHP. Creador de Larimar City & Resort.",
    images: ["/photos/avatar.jpg"],
  },
  robots: { index: true, follow: true },
};

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/juanandres_clerhp?igsh=MTI3emR1d2d0djNpcw%3D%3D&utm_source=qr",
    svg: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/juan-andres-romero-hernandez?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    svg: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@proximamentepodcast?_r=1&_t=ZS-95mW9C1Yw5s",
    svg: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.36a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.21z",
  },
  {
    name: "X",
    href: "https://x.com/ceo_clerhp?s=21",
    svg: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@proximamentepodcast?si=zrACi4EgJD7SAwlH",
    svg: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/show/1zrGBdSh888eF5xV2SOl8D?si=XtSbwc77SmeKh_Cx4VEKIg",
    svg: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12C24 5.4 18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z",
  },
];

const LINKS = [
  {
    label: "Sitio oficial",
    sub: "juanandresromero.es",
    href: "/",
  },
  {
    label: "Próxima Mente · Spotify",
    sub: "Escucha el podcast",
    href: "https://open.spotify.com/show/1zrGBdSh888eF5xV2SOl8D?si=XtSbwc77SmeKh_Cx4VEKIg",
    cover: "/brand/proxima-mente-cover.jpg",
  },
  {
    label: "Próxima Mente · YouTube",
    sub: "Mira los episodios",
    href: "https://youtube.com/@proximamentepodcast?si=zrACi4EgJD7SAwlH",
  },
  {
    label: "Larimar City & Resort",
    sub: "La primera smart city del Caribe",
    href: "https://larimarcity.com",
  },
  {
    label: "CLERHP Estructuras",
    sub: "Empresa cotizada · presidente",
    href: "https://clerhp.com",
  },
  {
    label: "Suscríbete a la newsletter",
    sub: "Reflexiones sobre territorio y legado",
    href: "/#newsletter",
  },
  {
    label: "Contacto directo",
    sub: "info@juanandresromero.es",
    href: "mailto:info@juanandresromero.es",
  },
];

export default function EnlacesPage() {
  return (
    <main className="lt">
      <div className="lt__inner">
        <div className="lt__avatar-ring">
          <Image
            src="/photos/avatar.jpg"
            alt="Juan Andrés Romero"
            width={480}
            height={480}
            priority
            className="lt__avatar"
          />
        </div>

        <h1 className="lt__name">Juan Andrés Romero</h1>
        <p className="lt__role">
          Arquitecto · CEO CLERHP · Larimar City &amp; Resort
        </p>
        <p className="lt__bio">
          Constructor de territorios. Anfitrión de Próxima Mente Podcast.
        </p>

        <ul className="lt__socials" aria-label="Redes sociales">
          {SOCIALS.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="lt__social"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                  <path d={s.svg} />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <ul className="lt__links">
          {LINKS.map((l) => {
            const isExternal = /^https?:\/\//.test(l.href) || l.href.startsWith("mailto:");
            return (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="lt__link"
                >
                  {l.cover && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={l.cover}
                      alt=""
                      className="lt__link-cover"
                      width={48}
                      height={48}
                    />
                  )}
                  <div className="lt__link-text">
                    <span className="lt__link-label">{l.label}</span>
                    <span className="lt__link-sub">{l.sub}</span>
                  </div>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="lt__link-arrow">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="lt__footer">
          © {new Date().getFullYear()} Juan Andrés Romero ·{" "}
          <a href="/aviso-legal">Aviso legal</a>
        </p>
      </div>

      <style>{`
        .lt {
          min-height: 100vh;
          padding: clamp(2.5rem, 6vw, 4rem) 1rem 4rem;
          background:
            radial-gradient(80% 50% at 50% 0%, rgba(12, 175, 254, 0.18) 0%, transparent 60%),
            radial-gradient(60% 40% at 50% 100%, rgba(6, 120, 255, 0.12) 0%, transparent 60%),
            #131311;
          color: #fff;
          display: flex;
          justify-content: center;
        }
        .lt__inner {
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .lt__avatar-ring {
          width: 132px;
          height: 132px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, #12C9F9 0%, #0CAFFE 50%, #0678FF 100%);
          margin-bottom: 1.25rem;
        }
        .lt__avatar {
          display: block;
          width: 126px;
          height: 126px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #131311;
        }
        .lt__name {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 0;
          text-align: center;
        }
        .lt__role {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          margin: 0.5rem 0 1rem;
          text-align: center;
        }
        .lt__bio {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.78);
          text-align: center;
          margin: 0 0 1.75rem;
          max-width: 32ch;
        }
        .lt__socials {
          display: flex;
          gap: 0.625rem;
          margin: 0 0 2rem;
          padding: 0;
          list-style: none;
          flex-wrap: wrap;
          justify-content: center;
        }
        .lt__social {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: transform 180ms var(--ease-out), background 180ms var(--ease-out), border-color 180ms var(--ease-out);
        }
        .lt__social:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        .lt__links {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          width: 100%;
          padding: 0;
          margin: 0 0 2rem;
          list-style: none;
        }
        .lt__link {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          width: 100%;
          padding: 0.875rem 1.125rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #fff;
          text-decoration: none;
          transition: transform 180ms var(--ease-out), background 180ms var(--ease-out), border-color 180ms var(--ease-out);
        }
        .lt__link:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
        }
        .lt__link-cover {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .lt__link-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }
        .lt__link-label {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .lt__link-sub {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.3;
        }
        .lt__link-arrow {
          color: rgba(255, 255, 255, 0.4);
          flex-shrink: 0;
          transition: transform 180ms var(--ease-out), color 180ms var(--ease-out);
        }
        .lt__link:hover .lt__link-arrow {
          color: #fff;
          transform: translateX(2px);
        }
        .lt__footer {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
          text-align: center;
        }
        .lt__footer a {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      `}</style>
    </main>
  );
}
