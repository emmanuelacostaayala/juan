"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <section className="site-footer__main">
        <div className="container">
          <div className="site-footer__grid">
            <div className="site-footer__col">
              <h3 className="uppercase-tag">Háblalo a tu</h3>
              <ul className="site-footer__links">
                <li><Link href="/#sobre-mi">Sobre mí</Link></li>
                <li><Link href="/#larimar-city">Larimar City</Link></li>
                <li><Link href="/#clerhp">CLERHP</Link></li>
                <li><Link href="/#articulos-y-medios">Artículos & medios</Link></li>
                <li><Link href="/#contacto">Contacto</Link></li>
              </ul>
            </div>

            <div className="site-footer__col">
              <h3 className="uppercase-tag">Contacto</h3>
              <ul className="site-footer__links">
                <li><a href="mailto:hola@juanandresromero.com">hola@juanandresromero.com</a></li>
                <li><a href="tel:+34900000000">+34 900 000 000</a></li>
              </ul>
            </div>

            <div className="site-footer__col">
              <h3 className="uppercase-tag">Redes</h3>
              <ul className="site-footer__links">
                <li>
                  <a
                    href="https://www.linkedin.com/in/juan-andres-romero-hernandez/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/juanandres_clerhp/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            <div className="site-footer__col site-footer__col--legal">
              <h3 className="uppercase-tag">Legal</h3>
              <ul className="site-footer__links">
                <li><Link href="/privacidad">Política de privacidad</Link></li>
                <li><Link href="/aviso-legal">Aviso legal</Link></li>
                <li><Link href="/cookies">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="site-footer__wordmark-wrap" aria-hidden="true">
            <span className="site-footer__wordmark">JUAN ANDRÉS ROMERO</span>
          </div>

          <div className="site-footer__bottom">
            <p>© {new Date().getFullYear()} Juan Andrés Romero. Todos los derechos reservados.</p>
            <p>Construyendo futuro, creando legado.</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .site-footer {
          background: var(--color-ink);
          color: var(--fg-on-dark);
          margin-top: auto;
        }

        .site-footer__main {
          padding-block: clamp(3rem, 6vw, 5rem) 2rem;
        }
        .site-footer__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
          padding-bottom: clamp(3rem, 8vw, 5rem);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .site-footer__col h3 {
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 1rem;
        }
        .site-footer__links {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .site-footer__links :global(a) {
          font-size: var(--fs-15);
          color: rgba(255, 255, 255, 0.82);
          transition: color 180ms var(--ease-out);
        }
        .site-footer__links :global(a:hover) {
          color: var(--color-accent);
        }

        .site-footer__wordmark-wrap {
          padding-block: clamp(3rem, 8vw, 5rem) 2rem;
          text-align: center;
          overflow: hidden;
        }
        .site-footer__wordmark {
          display: block;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: clamp(2.5rem, 13.5vw, 13rem);
          line-height: 0.9;
          letter-spacing: -0.05em;
          color: var(--color-white);
          white-space: nowrap;
        }

        .site-footer__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--fg-on-dark-muted);
          font-size: var(--fs-13);
        }

        @media (max-width: 900px) {
          .site-footer__grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
          .site-footer__bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        @media (max-width: 560px) {
          .site-footer__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
