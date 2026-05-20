"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Sobre mí", href: "/#sobre-mi" },
  { label: "Larimar City", href: "/#larimar-city" },
  { label: "CLERHP", href: "/#clerhp" },
  { label: "Artículos", href: "/#articulos-y-medios" },
  { label: "Podcast", href: "/#podcast" },
  { label: "Newsletter", href: "/#newsletter" },
];


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container site-header__row">
          <Link href="/" className="site-header__logo" aria-label="Juan Andrés Romero · Inicio">
            <Image
              src="/brand/jar-wordmark.png"
              alt="Juan Andrés Romero · Arquitecto"
              width={1000}
              height={135}
              priority
              className="site-header__logo-img"
            />
          </Link>

          <nav className="site-header__nav" aria-label="Principal">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`site-header__link ${pathname === link.href ? "is-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="site-header__cta">
            <Link href="/#contacto" className="btn btn--dark site-header__contact">
              <span>Contacto</span>
              <span className="site-header__contact-dot" aria-hidden="true" />
            </Link>
          </div>

          <button
            type="button"
            className={`site-header__toggle ${menuOpen ? "is-open" : ""}`}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <nav
        className={`site-header__mobile ${menuOpen ? "is-open" : ""}`}
        aria-label="Móvil"
      >
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="site-header__mobile-link">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#contacto" className="site-header__mobile-link is-cta">
              Contacto
            </Link>
          </li>
        </ul>
      </nav>

      <style jsx>{`
        .site-header {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 60;
          padding-block: 1rem;
          transition: background-color 250ms var(--ease-out), border-color 250ms var(--ease-out), backdrop-filter 250ms var(--ease-out);
          border-bottom: 1px solid transparent;
        }
        .site-header.is-scrolled {
          background: rgba(25, 25, 23, 0.88);
          backdrop-filter: saturate(180%) blur(16px);
          -webkit-backdrop-filter: saturate(180%) blur(16px);
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }
        .site-header__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          color: var(--color-white);
        }
        :global(.site-header__logo) {
          display: inline-flex;
          align-items: center;
          color: var(--color-white);
        }
        :global(.site-header__logo-img) {
          display: block;
          width: auto;
          height: 32px;
        }
        @media (max-width: 560px) {
          :global(.site-header__logo-img) {
            height: 24px;
          }
        }
        .site-header__nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .site-header__link {
          font-size: var(--fs-13);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.82);
          transition: color 180ms var(--ease-out);
          position: relative;
          padding-block: 0.25rem;
        }
        .site-header__link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: var(--color-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 220ms var(--ease-out);
        }
        .site-header__link:hover,
        .site-header__link.is-active {
          color: var(--color-white);
        }
        .site-header__link:hover::after,
        .site-header__link.is-active::after {
          transform: scaleX(1);
        }
        .site-header__cta :global(.btn) {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 1rem 0.625rem 1.25rem;
          font-size: var(--fs-13);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--color-white);
          color: var(--color-ink);
        }
        .site-header__cta :global(.btn:hover) {
          background: var(--color-cream);
        }
        .site-header__cta :global(.site-header__contact-dot) {
          display: inline-block;
          width: 12px;
          height: 12px;
          background: var(--color-accent);
          border-radius: 2px;
          transition: transform 200ms var(--ease-out);
        }
        .site-header__cta :global(.btn:hover .site-header__contact-dot) {
          transform: scale(1.15);
        }
        .site-header__toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 24px;
          height: 16px;
        }
        .site-header__toggle span {
          display: block;
          height: 1.5px;
          width: 100%;
          background: var(--color-white);
          transition: transform 220ms var(--ease-out), opacity 220ms var(--ease-out);
          transform-origin: center;
        }
        .site-header__toggle.is-open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .site-header__toggle.is-open span:nth-child(2) {
          opacity: 0;
        }
        .site-header__toggle.is-open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .site-header__mobile {
          position: fixed;
          inset: 0;
          z-index: 55;
          background: var(--color-ink);
          padding: 5rem var(--container-gutter) 2rem;
          opacity: 0;
          visibility: hidden;
          transition: opacity 240ms var(--ease-out), visibility 240ms var(--ease-out);
        }
        .site-header__mobile.is-open {
          opacity: 1;
          visibility: visible;
        }
        .site-header__mobile ul {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 2rem;
        }
        .site-header__mobile :global(.site-header__mobile-link) {
          display: block;
          font-size: var(--fs-28);
          font-weight: 500;
          letter-spacing: var(--ls-tight-sm);
          color: var(--color-white);
          padding-block: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .site-header__mobile :global(.site-header__mobile-link.is-cta) {
          color: var(--color-accent);
          border-bottom: none;
          margin-top: 1.5rem;
        }

        @media (max-width: 900px) {
          .site-header__nav,
          .site-header__cta {
            display: none;
          }
          .site-header__toggle {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
