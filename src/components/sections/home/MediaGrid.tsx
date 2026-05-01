"use client";

import Image from "next/image";
import { images } from "@/lib/assets";
import { Reveal } from "@/lib/motion";

const ARTICLES = [
  {
    tag: "Reportaje",
    title: "Larimar City & Resort entra en el porfolio de inversión internacional de República Dominicana",
    outlet: "Murcia Diario",
    date: "Junio 2025",
    href: "https://www.murciadiario.com/articulo/empresas/larimar-triuf/20250613112354128802.html",
    image: images.thumb1,
  },
  {
    tag: "Reportaje",
    title: "Clerhp inicia la construcción del área residencial principal de Larimar City",
    outlet: "Murcia Plaza",
    date: "Mayo 2025",
    href: "https://murciaplaza.com/murciaplaza/empresas-murcia/clerhp-inicia-la-construccion-de-la-principal-area-residencial-de-larimar-city-en-la-republica-dominicana",
    image: images.thumb2,
  },
  {
    tag: "Entrevista",
    title: "Juan Andrés Romero, consejero delegado de Clerhp",
    outlet: "Revista Consejeros",
    date: "Febrero 2025",
    href: "https://revistaconsejeros.com/sumario/entrevistas/consejeros/juan-andres-romero-consejero-delegado-de-clerhp/",
    image: images.thumb3,
  },
  {
    tag: "Reportaje",
    title: "Forbes se fija en Larimar City, el gran proyecto de Clerhp en la República Dominicana",
    outlet: "Empresas de Murcia",
    date: "2024",
    href: "https://murcia.empresas.de/forbes-se-fija-en-larimar-city-el-gran-proyecto-de-clerhp-en-la-republica-dominicana/",
    image: images.thumb4,
  },
  {
    tag: "Reportaje",
    title: "La murciana CLERHP inaugura Larimar City & Resort, la primera smart city de República Dominicana",
    outlet: "Elite Murcia",
    date: "2024",
    href: "https://elitemurcia.es/la-murciana-clerhp-ianugura-larimar-city-resort-la-primera-smart-city-de-republica-dominicana/",
    image: images.thumb5,
  },
  {
    tag: "Reportaje",
    title: "De Murcia al Caribe para levantar la primera smart city del Caribe",
    outlet: "El Economista",
    date: "Febrero 2023",
    href: "https://www.eleconomista.es/vivienda-inmobiliario/noticias/12166542/02/23/De-Murcia-al-Caribe-para-levantar-mas-de-22000-viviendas-.html",
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
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="media__link"
                >
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
                </a>
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
          transition: transform 220ms var(--ease-out);
        }
        .media__item:hover {
          transform: translateY(-4px);
        }
        .media__link {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          color: inherit;
          text-decoration: none;
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
