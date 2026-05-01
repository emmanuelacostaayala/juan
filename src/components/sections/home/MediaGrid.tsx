"use client";

import Image from "next/image";
import { images } from "@/lib/assets";
import { Reveal } from "@/lib/motion";

const ARTICLES = [
  {
    tag: "Análisis",
    title: "Clerhp se prepara para 2026 con un balance sólido, preventas al alza y una marca más visible",
    outlet: "Estrategias de Inversión",
    date: "Marzo 2026",
    href: "https://www.estrategiasdeinversion.com/analisis/bolsa-y-mercados/el-experto-opina/clerhp-se-prepara-para-2026-con-un-balance-solido-n-862849",
    image: images.thumb1,
  },
  {
    tag: "Reportaje",
    title: "Larimar City & Resort entra en el porfolio de inversión internacional de República Dominicana",
    outlet: "Murcia Diario",
    date: "Junio 2025",
    href: "https://www.murciadiario.com/articulo/empresas/larimar-triuf/20250613112354128802.html",
    image: images.thumb2,
  },
  {
    tag: "Informe",
    title: "Larimar City & Resort representa hoy una de las mejores oportunidades de inversión inmobiliaria en el Caribe",
    outlet: "Estrategias de Inversión",
    date: "Mayo 2025",
    href: "https://www.estrategiasdeinversion.com/analisis/bolsa-y-mercados/informes/clerhp-larimar-city-resort-representa-hoy-una-n-817479",
    image: images.thumb3,
  },
  {
    tag: "Reportaje",
    title: "Clerhp inicia la construcción del área residencial principal de Larimar City",
    outlet: "Murcia Plaza",
    date: "Mayo 2025",
    href: "https://murciaplaza.com/murciaplaza/empresas-murcia/clerhp-inicia-la-construccion-de-la-principal-area-residencial-de-larimar-city-en-la-republica-dominicana",
    image: images.thumb4,
  },
  {
    tag: "Noticia",
    title: "Larimar City & Resort impulsa su expansión en Europa con nueva sede en Málaga",
    outlet: "Estrategias de Inversión",
    date: "2025",
    href: "https://www.estrategiasdeinversion.com/actualidad/noticias/bolsa-espana/larimar-city-resort-impulsa-su-expansion-en-europa-n-864393",
    image: images.thumb5,
  },
  {
    tag: "Entrevista",
    title: "Juan Andrés Romero, consejero delegado de Clerhp",
    outlet: "Revista Consejeros",
    date: "Febrero 2025",
    href: "https://revistaconsejeros.com/sumario/entrevistas/consejeros/juan-andres-romero-consejero-delegado-de-clerhp/",
    image: images.thumb6,
  },
  {
    tag: "Vídeo",
    title: "El megaproyecto Larimar dispara las oportunidades de crecimiento de Clerhp",
    outlet: "Estrategias de Inversión · YouTube",
    date: "Marzo 2025",
    href: "https://www.youtube.com/watch?v=7_62UxU11pM",
    image: images.thumb1,
  },
  {
    tag: "Reportaje",
    title: "Forbes se fija en Larimar City, el gran proyecto de Clerhp en la República Dominicana",
    outlet: "Empresas de Murcia",
    date: "2024",
    href: "https://murcia.empresas.de/forbes-se-fija-en-larimar-city-el-gran-proyecto-de-clerhp-en-la-republica-dominicana/",
    image: images.thumb2,
  },
  {
    tag: "Reportaje",
    title: "La murciana CLERHP inaugura Larimar City & Resort, la primera smart city de República Dominicana",
    outlet: "Elite Murcia",
    date: "2024",
    href: "https://elitemurcia.es/la-murciana-clerhp-ianugura-larimar-city-resort-la-primera-smart-city-de-republica-dominicana/",
    image: images.thumb3,
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
