"use client";

import Image from "next/image";
import { images } from "@/lib/assets";
import { Reveal } from "@/lib/motion";

const ARTICLES = [
  {
    tag: "Opinión",
    title: "Proyectos que transforman territorios",
    outlet: "Expansión",
    date: "Marzo 2026",
    image: images.thumb1,
  },
  {
    tag: "Entrevista",
    title: "Una nueva forma de construir ciudad",
    outlet: "Vozpópuli",
    date: "Febrero 2026",
    image: images.thumb2,
  },
  {
    tag: "Reportaje",
    title: "CLERHP y la ingeniería que mira lejos",
    outlet: "La Razón",
    date: "Enero 2026",
    image: images.thumb3,
  },
  {
    tag: "Opinión",
    title: "Arquitectura con visión de legado",
    outlet: "El Mundo",
    date: "Diciembre 2025",
    image: images.thumb4,
  },
  {
    tag: "Entrevista",
    title: "Larimar City: el destino que viene",
    outlet: "ABC",
    date: "Noviembre 2025",
    image: images.thumb5,
  },
  {
    tag: "Reportaje",
    title: "Construir desde el territorio",
    outlet: "Cinco Días",
    date: "Octubre 2025",
    image: images.thumb6,
  },
];

export default function MediaGrid() {
  return (
    <section id="articulos-y-medios" className="media section--dark">
      <div className="container">
        <Reveal>
          <header className="media__head">
            <p className="uppercase-tag media__tag">Artículos &amp; medios</p>
            <h2 className="media__title">
              Proyectos<br />que transforman<br />territorios.
            </h2>
            <p className="media__sub">
              Una selección de publicaciones y apariciones en medios sobre
              arquitectura, empresa y la visión detrás de Larimar City.
            </p>
          </header>
        </Reveal>

        <ul className="media__grid">
          {ARTICLES.map((a, i) => (
            <Reveal key={a.title} delay={0.04 * i}>
              <li className="media__item">
                <div className="media__cover">
                  <Image
                    src={a.image}
                    alt={`${a.tag} en ${a.outlet}: ${a.title}`}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 30vw"
                    className="media__img"
                  />
                </div>
                <div className="media__body">
                  <span className="media__meta">
                    {a.tag} · {a.outlet} · {a.date}
                  </span>
                  <h3 className="media__item-title">{a.title}</h3>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .media {
          background: var(--color-ink);
          color: var(--color-white);
          scroll-margin-top: 5rem;
          padding-block: clamp(4rem, 9vw, 7rem);
        }
        .media__head {
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
          max-width: 680px;
        }
        .media__tag {
          color: var(--color-accent);
          margin-bottom: 1rem;
        }
        .media__title {
          font-size: clamp(var(--fs-36), 6vw, 5.5rem);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.95;
          margin: 0 0 1.5rem;
          color: var(--color-white);
        }
        .media__sub {
          font-size: var(--fs-18);
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.55;
          max-width: 56ch;
        }
        .media__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem 1.5rem;
        }
        .media__item {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform 220ms var(--ease-out);
          cursor: pointer;
        }
        .media__item:hover {
          transform: translateY(-4px);
        }
        .media__cover {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #1a1a18;
        }
        .media__cover :global(.media__img) {
          object-fit: cover;
          object-position: center;
          transition: transform 420ms var(--ease-out);
        }
        .media__item:hover .media__cover :global(.media__img) {
          transform: scale(1.04);
        }
        .media__body {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .media__meta {
          font-size: var(--fs-13);
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.04em;
        }
        .media__item-title {
          font-size: var(--fs-24);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: var(--color-white);
        }
        @media (max-width: 900px) {
          .media__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 560px) {
          .media__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
