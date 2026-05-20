"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type Slide = {
  src: string;
  alt: string;
  caption?: string;
};

export default function RenderSlider({
  slides,
  autoPlayMs = 5500,
}: {
  slides: Slide[];
  autoPlayMs?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => {
      const n = slides.length;
      setIdx(((next % n) + n) % n);
    },
    [slides.length],
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(idx + 1), autoPlayMs);
    return () => clearInterval(t);
  }, [idx, paused, go, autoPlayMs]);

  return (
    <div
      className="render-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="render-slider__viewport">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={`render-slider__slide ${i === idx ? "is-active" : ""}`}
            aria-hidden={i !== idx}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="render-slider__img"
              priority={i === 0}
            />
            {s.caption ? (
              <div className="render-slider__caption">{s.caption}</div>
            ) : null}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="render-slider__btn render-slider__btn--prev"
        onClick={() => go(idx - 1)}
        aria-label="Render anterior"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M15 6 9 12l6 6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className="render-slider__btn render-slider__btn--next"
        onClick={() => go(idx + 1)}
        aria-label="Render siguiente"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="m9 6 6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="render-slider__dots" role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`render-slider__dot ${i === idx ? "is-active" : ""}`}
            onClick={() => go(i)}
            aria-label={`Ir al render ${i + 1}`}
            aria-selected={i === idx}
            role="tab"
          />
        ))}
      </div>

      <style jsx>{`
        .render-slider {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #0e1c22;
        }
        .render-slider__viewport {
          position: absolute;
          inset: 0;
        }
        .render-slider__slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 700ms var(--ease-out);
        }
        .render-slider__slide.is-active {
          opacity: 1;
        }
        .render-slider :global(.render-slider__img) {
          object-fit: cover;
          object-position: center;
        }
        .render-slider__caption {
          position: absolute;
          left: 1rem;
          bottom: 4rem;
          padding: 0.4rem 0.75rem;
          font-size: var(--fs-13);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-white);
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: var(--radius-pill);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .render-slider__btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: var(--color-white);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.18);
          cursor: pointer;
          transition: background 200ms var(--ease-out), transform 200ms var(--ease-out);
        }
        .render-slider__btn:hover {
          background: rgba(0, 0, 0, 0.65);
          transform: translateY(-50%) scale(1.05);
        }
        .render-slider__btn--prev {
          left: 1rem;
        }
        .render-slider__btn--next {
          right: 1rem;
        }
        .render-slider__dots {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 1.25rem;
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }
        .render-slider__dot {
          width: 24px;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.35);
          border: 0;
          cursor: pointer;
          transition: background 220ms var(--ease-out), width 220ms var(--ease-out);
        }
        .render-slider__dot.is-active {
          background: var(--color-white);
          width: 40px;
        }
        @media (max-width: 560px) {
          .render-slider__btn {
            width: 36px;
            height: 36px;
          }
          .render-slider__btn--prev {
            left: 0.5rem;
          }
          .render-slider__btn--next {
            right: 0.5rem;
          }
          .render-slider__caption {
            bottom: 3rem;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}
