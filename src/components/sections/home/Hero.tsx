"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { images } from "@/lib/assets";

const EASE = [0.16, 1, 0.3, 1] as const;
const YT_ID = "AMHMpkYypsA";

export default function Hero() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="home-hero">
      <div className="home-hero__media" aria-hidden="true">
        <picture>
          <source
            media="(orientation: portrait)"
            srcSet="/photos/hero-portrait.jpg"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images.heroPool}
            alt=""
            className="home-hero__img"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
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
            {playing ? (
              <iframe
                className="home-hero__iframe"
                src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="Juan Andrés Romero — CEO Larimar City"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className="home-hero__play-wrap"
                onClick={() => setPlaying(true)}
                aria-label="Reproducir vídeo de presentación"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${YT_ID}/hqdefault.jpg`}
                  alt="Juan Andrés Romero — vídeo de presentación"
                  className="home-hero__video-img"
                  loading="eager"
                />
                <span className="home-hero__play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </span>
                <span className="home-hero__video-label">
                  <span>Juan Andrés Romero</span>
                  <span className="home-hero__video-badge">CEO Larimar City</span>
                </span>
              </button>
            )}
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
        .home-hero__media picture,
        .home-hero__media .home-hero__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .home-hero__img {
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
        :global(.home-hero__quote) {
          max-width: 26ch;
          margin: 0;
          text-align: left;
        }
        .home-hero__quote-text {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(var(--fs-18), 1.6vw, var(--fs-24));
          line-height: 1.35;
          color: var(--color-white);
          margin: 0 0 2rem;
          text-align: left;
          text-shadow: 0 1px 30px rgba(0,0,0,0.35);
        }
        :global(.home-hero__link) {
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
        :global(.home-hero__link:hover) {
          color: rgba(255,255,255,0.65);
          border-color: rgba(255,255,255,0.35);
        }
        :global(.home-hero__video) {
          width: 340px;
          align-self: end;
        }
        .home-hero__video-frame {
          position: relative;
          aspect-ratio: 16/9;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #1a1a18;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        }
        .home-hero__play-wrap {
          position: absolute;
          inset: 0;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          display: block;
        }
        .home-hero__video-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 320ms var(--ease-out);
        }
        .home-hero__play-wrap:hover .home-hero__video-img {
          transform: scale(1.04);
        }
        .home-hero__iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
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
        .home-hero__play-wrap:hover .home-hero__play {
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
        :global(.home-hero__scroll) {
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
          :global(.home-hero__video) { width: 260px; justify-self: end; }
        }
        @media (max-width: 640px) {
          :global(.home-hero__scroll) { display: none; }
          :global(.home-hero__video) { width: 200px; }
        }
      `}</style>
    </section>
  );
}
