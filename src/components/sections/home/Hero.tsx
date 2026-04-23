"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { images } from "@/lib/assets";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero__media" aria-hidden="true">
        <Image
          src={images.heroMarina}
          alt=""
          fill
          priority
          sizes="100vw"
          className="home-hero__img"
          style={{ objectFit: "cover", objectPosition: "center 25%" }}
        />
        <div className="home-hero__media-overlay" />
      </div>

      <div className="container home-hero__inner">
        <motion.blockquote
          className="home-hero__quote"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
        >
          <p className="home-hero__quote-text">
            &ldquo;Lidero desde la integridad, la visión y la convicción de
            que los grandes sueños se construyen paso a paso, con valores y
            equipo.&rdquo;
          </p>
          <Link href="/#sobre-mi" className="home-hero__link">
            Conoce mi visión
          </Link>
        </motion.blockquote>

        <motion.aside
          className="home-hero__video"
          aria-label="Vídeo de presentación"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
        >
          <div className="home-hero__video-frame">
            <Image
              src={images.portraitDesk}
              alt="Juan Andrés Romero en entrevista"
              fill
              sizes="(max-width: 720px) 200px, 320px"
              className="home-hero__video-img"
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
            <button type="button" className="home-hero__play" aria-label="Reproducir vídeo">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </button>
            <div className="home-hero__video-label">
              <span>Juan Andrés Romero</span>
              <span className="home-hero__video-badge">Larimar</span>
            </div>
          </div>
        </motion.aside>
      </div>

      <motion.div
        className="home-hero__scroll"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <span>scroll</span>
        <span className="home-hero__scroll-line" />
      </motion.div>

      <style jsx>{`
        .home-hero {
          position: relative;
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: flex-end;
          color: var(--color-white);
          overflow: hidden;
          padding-top: 6rem;
          padding-bottom: clamp(3rem, 6vw, 5rem);
          background: #0a0a09;
        }
        .home-hero__media {
          position: absolute;
          inset: 0;
          background: #0a0a09;
        }
        .home-hero__media :global(.home-hero__img) {
          object-fit: cover;
          object-position: center 25%;
        }
        .home-hero__media-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.72) 100%);
        }
        .home-hero__inner {
          position: relative;
          z-index: 1;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 2rem;
        }
        .home-hero__quote {
          max-width: 30ch;
          margin: 0;
        }
        .home-hero__quote-text {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(var(--fs-18), 1.6vw, var(--fs-24));
          line-height: 1.35;
          color: var(--color-white);
          margin: 0 0 1.25rem;
          text-wrap: balance;
          text-shadow: 0 1px 30px rgba(0,0,0,0.35);
        }
        .home-hero__link {
          display: inline-block;
          font-size: var(--fs-13);
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-white);
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(255,255,255,0.7);
          transition: color 180ms var(--ease-out), border-color 180ms var(--ease-out);
        }
        .home-hero__link:hover {
          color: rgba(255,255,255,0.65);
          border-color: rgba(255,255,255,0.35);
        }
        .home-hero__video {
          width: 280px;
          align-self: end;
        }
        .home-hero__video-frame {
          position: relative;
          aspect-ratio: 16/10;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #1a1a18;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        }
        .home-hero__video-frame :global(.home-hero__video-img) {
          object-fit: cover;
          object-position: center;
        }
        .home-hero__play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          color: var(--color-ink);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding-left: 3px;
          transition: transform 200ms var(--ease-out), background 200ms var(--ease-out);
        }
        .home-hero__play:hover {
          transform: translate(-50%,-50%) scale(1.08);
          background: var(--color-white);
        }
        .home-hero__video-label {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          padding: 0.625rem 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          font-size: var(--fs-13);
          color: var(--color-white);
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%);
        }
        .home-hero__video-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-pill);
          background: rgba(255,255,255,0.15);
          color: var(--color-white);
          border: 1px solid rgba(255,255,255,0.3);
        }
        .home-hero__scroll {
          position: absolute;
          right: var(--container-gutter);
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          writing-mode: vertical-rl;
          z-index: 1;
        }
        .home-hero__scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(180deg, rgba(255,255,255,0.5), transparent);
          animation: scrollLine 2.2s var(--ease-out) infinite;
        }
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @media (max-width: 900px) {
          .home-hero__inner { grid-template-columns: 1fr; }
          .home-hero__video { width: 220px; justify-self: end; }
        }
        @media (max-width: 640px) {
          .home-hero__scroll { display: none; }
          .home-hero__video { width: 180px; }
        }
      `}</style>
    </section>
  );
}
