"use client";

import { useState } from "react";
import { Reveal, slideLeft, slideRight } from "@/lib/motion";

type Chapter = {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
};

const CHAPTERS: Chapter[] = [
  { id: "3lJUlcttiYA", date: "Abril 2026", title: "Avance de obras Abril 2026", subtitle: "Contado por Juan Andrés Romero — narración en primera persona." },
  { id: "g5vMjS4yfUU", date: "Abril 2026 · Parte 4", title: "Prime Towers avanza a ritmo constante", subtitle: "Estructura de Prime Towers y ritmo de obra." },
  { id: "haqgdDQOna8", date: "Abril 2026 · Parte 5", title: "Los amenities cogen forma", subtitle: "Avance de las amenidades de la Fase 1." },
  { id: "hqjAnyyLqEc", date: "Abril 2026 · Parte 3", title: "Skyline y amenities de la FASE 1", subtitle: "El skyline empieza a dibujarse." },
  { id: "tWBhPOO-52g", date: "Marzo 2026", title: "Avance de Obras — Marzo 2026", subtitle: "Estado general del proyecto a marzo." },
  { id: "_iVG4PQp7Rg", date: "Febrero 2026", title: "Prime Towers, Breeze Towers, Amanalu & Amenities", subtitle: "Avance integral de las torres y zonas comunes." },
  { id: "qXaH9Bnn9iI", date: "Febrero 2026", title: "AVANCE DE OBRA Febrero 2026", subtitle: "Resumen visual de febrero." },
  { id: "4sxh6jS_08E", date: "Diciembre 2025", title: "Avance de Obras Diciembre 2025", subtitle: "Cierre de año en obra." },
  { id: "x_NQpPEXnaE", date: "Noviembre 2025", title: "Avance de obra Noviembre 2025", subtitle: "Estructuras y urbanización avanzan." },
  { id: "iA-_mlfzRdA", date: "Ago–Sep 2025", title: "Avance de obra Agosto y Septiembre 2025", subtitle: "Movimiento de tierras y primeras cimentaciones." },
  { id: "UR21KleWlXU", date: "Julio 2025", title: "Prime Towers — Julio 2025", subtitle: "Arranque de Prime Towers." },
  { id: "M8uCVovx3NQ", date: "Junio 2025", title: "Avance de obras Junio 2025", subtitle: "Primer registro mensual del recorrido." },
  { id: "aPu8QDXm5cY", date: "Hito", title: "Primera voladura de Larimar City & Resort", subtitle: "Inicio simbólico de la construcción." },
  { id: "bweQ7CyY_UQ", date: "Hito", title: "Instalación de las grúas en Prime Towers", subtitle: "Llegan las grúas torre a la parcela." },
];

export default function LarimarProgress() {
  const [activeId, setActiveId] = useState<string>(CHAPTERS[0].id);
  const active = CHAPTERS.find((c) => c.id === activeId) ?? CHAPTERS[0];

  return (
    <section id="avances-obra" className="progress section--deep">
      <div className="container">
        <Reveal>
          <header className="progress__head">
            <p className="uppercase-tag progress__tag">Avances de obra</p>
            <h2 className="progress__title">
              Larimar City,<br />mes a mes en obra.
            </h2>
            <p className="progress__sub">
              Recorridos filmados desde la parcela. Cada capítulo documenta el
              avance real de Prime Towers, Breeze Towers, Amanalu y los
              amenities de la Fase 1.
            </p>
          </header>
        </Reveal>

        <div className="progress__grid">
          <Reveal variants={slideLeft}>
            <div className="progress__player">
              <div className="progress__player-frame">
                <iframe
                  key={active.id}
                  src={`https://www.youtube.com/embed/${active.id}?rel=0&modestbranding=1`}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="progress__player-meta">
                <p className="progress__player-date">{active.date}</p>
                <h3 className="progress__player-title">{active.title}</h3>
                {active.subtitle ? (
                  <p className="progress__player-sub">{active.subtitle}</p>
                ) : null}
              </div>
            </div>
          </Reveal>

          <Reveal variants={slideRight}>
            <aside className="progress__chapters" aria-label="Capítulos">
              <p className="progress__chapters-label">Capítulos</p>
              <ul className="progress__list">
                {CHAPTERS.map((c) => {
                  const isActive = c.id === activeId;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        className={`progress__chapter ${isActive ? "is-active" : ""}`}
                        onClick={() => setActiveId(c.id)}
                        aria-current={isActive ? "true" : undefined}
                      >
                        <span className="progress__chapter-thumb">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://i.ytimg.com/vi/${c.id}/mqdefault.jpg`}
                            alt=""
                            loading="lazy"
                          />
                          {isActive ? (
                            <span className="progress__chapter-play" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="14" height="14">
                                <path d="M8 5v14l11-7z" fill="currentColor" />
                              </svg>
                            </span>
                          ) : null}
                        </span>
                        <span className="progress__chapter-text">
                          <span className="progress__chapter-date">{c.date}</span>
                          <span className="progress__chapter-title">{c.title}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <a
                href="https://www.youtube.com/playlist?list=PLMHsjx2fHZ_DV6YeGz9VZ8ZGlEXyItcKK"
                target="_blank"
                rel="noopener noreferrer"
                className="progress__playlist-link"
              >
                Ver playlist completa en YouTube →
              </a>
            </aside>
          </Reveal>
        </div>
      </div>

      <style jsx>{`
        .progress {
          padding-block: var(--section-y);
          scroll-margin-top: 5rem;
        }
        .progress__head {
          max-width: 720px;
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }
        .progress__tag {
          color: #0CAFFE;
          margin-bottom: 1rem;
        }
        .progress__title {
          font-size: clamp(var(--fs-36), 6vw, var(--fs-68));
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.95;
          margin: 0 0 1.5rem;
          color: var(--color-white);
        }
        .progress__sub {
          font-size: var(--fs-18);
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.55;
          max-width: 60ch;
        }
        .progress__grid {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
          gap: clamp(1.5rem, 3vw, 2.5rem);
          align-items: start;
        }
        .progress__player {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .progress__player-frame {
          position: relative;
          aspect-ratio: 16/9;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #000;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        .progress__player-frame :global(iframe) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
        .progress__player-date {
          font-size: var(--fs-13);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0CAFFE;
          margin: 0 0 0.5rem;
        }
        .progress__player-title {
          font-size: clamp(var(--fs-20), 2.5vw, var(--fs-28));
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: var(--color-white);
          margin: 0 0 0.5rem;
        }
        .progress__player-sub {
          color: rgba(255, 255, 255, 0.65);
          font-size: var(--fs-15);
          line-height: 1.55;
          margin: 0;
          max-width: 64ch;
        }

        .progress__chapters {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 640px;
          padding-right: 0.25rem;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
        }
        .progress__chapters::-webkit-scrollbar {
          width: 4px;
        }
        .progress__chapters::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 2px;
        }
        .progress__chapters-label {
          font-size: var(--fs-13);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }
        .progress__list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .progress__chapter {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          width: 100%;
          padding: 0.5rem;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
          transition: background 180ms var(--ease-out), border-color 180ms var(--ease-out);
        }
        .progress__chapter:hover {
          background: rgba(255, 255, 255, 0.04);
        }
        .progress__chapter.is-active {
          background: rgba(12, 175, 254, 0.08);
          border-color: rgba(12, 175, 254, 0.45);
        }
        .progress__chapter-thumb {
          position: relative;
          flex: 0 0 auto;
          width: 96px;
          aspect-ratio: 16/9;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #111;
        }
        .progress__chapter-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .progress__chapter-play {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          color: #0CAFFE;
        }
        .progress__chapter-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }
        .progress__chapter-date {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }
        .progress__chapter.is-active .progress__chapter-date {
          color: #0CAFFE;
        }
        .progress__chapter-title {
          font-size: var(--fs-14);
          font-weight: 500;
          color: var(--color-white);
          line-height: 1.3;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .progress__playlist-link {
          display: inline-block;
          margin-top: 0.5rem;
          font-size: var(--fs-13);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          transition: color 180ms var(--ease-out), border-color 180ms var(--ease-out);
          align-self: flex-start;
        }
        .progress__playlist-link:hover {
          color: #0CAFFE;
          border-color: #0CAFFE;
        }

        @media (max-width: 900px) {
          .progress__grid {
            grid-template-columns: 1fr;
          }
          .progress__chapters {
            max-height: none;
          }
        }
      `}</style>
    </section>
  );
}
