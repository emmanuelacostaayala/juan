"use client";

import Image from "next/image";
import { images } from "@/lib/assets";
import { Reveal, slideLeft, slideRight } from "@/lib/motion";
import RenderSlider, { type Slide } from "@/components/RenderSlider";

const RENDERS_DIR = "/larimar/renders";

const SLIDER_SLIDES: Slide[] = [
  { src: `${RENDERS_DIR}/larimar-overview-01.jpg`, alt: "Larimar City — vista aérea Fase 1", caption: "Larimar City · Fase 1" },
  { src: `${RENDERS_DIR}/prime-towers-01.jpg`, alt: "Prime Towers — render exterior", caption: "Prime Towers" },
  { src: `${RENDERS_DIR}/horizon-view-01.jpg`, alt: "Horizon View — render exterior", caption: "Horizon View" },
  { src: `${RENDERS_DIR}/paradise-towers-01.jpg`, alt: "Paradise Towers — render al atardecer", caption: "Paradise Towers" },
  { src: `${RENDERS_DIR}/breeze-towers-01.jpg`, alt: "Breeze Towers — render exterior", caption: "Breeze Towers" },
  { src: `${RENDERS_DIR}/townhouses-01.jpg`, alt: "Townhouses — render exterior", caption: "Townhouses" },
  { src: `${RENDERS_DIR}/villas-golf-01.jpg`, alt: "Villas Golf — render exterior", caption: "Villas Golf" },
  { src: `${RENDERS_DIR}/sunset-residences-01.jpg`, alt: "Sunset Residences — render exterior", caption: "Sunset Residences" },
  { src: `${RENDERS_DIR}/live-towers-01.jpg`, alt: "Live Towers — render exterior", caption: "Live Towers" },
];

type Project = {
  key: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

const PROJECTS: Project[] = [
  {
    key: "prime",
    title: "Prime Towers",
    description:
      "Torres residenciales premium con vistas panorámicas. Tipologías amplias y acabados de gama alta en el corazón del masterplan.",
    image: `${RENDERS_DIR}/prime-towers-01.jpg`,
    alt: "Prime Towers — render exterior",
  },
  {
    key: "horizon",
    title: "Horizon View",
    description:
      "Edificios de uso mixto con apartamentos exteriores, zonas verdes y un perfil arquitectónico tropical pensado para la luz natural.",
    image: `${RENDERS_DIR}/horizon-view-01.jpg`,
    alt: "Horizon View — render exterior",
  },
  {
    key: "paradise",
    title: "Paradise Towers",
    description:
      "Torres residenciales de gran altura frente al lago central. Apartamentos y áticos con vistas abiertas al Caribe y al masterplan.",
    image: `${RENDERS_DIR}/paradise-towers-01.jpg`,
    alt: "Paradise Towers — render al atardecer",
  },
  {
    key: "breeze",
    title: "Breeze Towers",
    description:
      "Conjunto de torres con tipologías compactas pensadas para inversión y residencia flexible, junto a las amenidades centrales.",
    image: `${RENDERS_DIR}/breeze-towers-01.jpg`,
    alt: "Breeze Towers — render del conjunto residencial",
  },
  {
    key: "townhouses",
    title: "Townhouses",
    description:
      "Viviendas adosadas con jardín privado y acceso directo a las amenidades. Pensadas para vida familiar dentro de la ciudad-destino.",
    image: `${RENDERS_DIR}/townhouses-01.jpg`,
    alt: "Townhouses — render de viviendas adosadas",
  },
  {
    key: "villas-golf",
    title: "Villas Golf",
    description:
      "Villas exclusivas con vistas al campo de golf y al océano. Programa premium en parcelas amplias con piscina y jardín privados.",
    image: `${RENDERS_DIR}/villas-golf-01.jpg`,
    alt: "Villas Golf — render exterior",
  },
  {
    key: "sunset",
    title: "Sunset Residences",
    description:
      "Apartamentos residenciales orientados al atardecer caribeño. Volumetría escalonada y terrazas que abren al paisaje y al horizonte.",
    image: `${RENDERS_DIR}/sunset-residences-01.jpg`,
    alt: "Sunset Residences — render exterior",
  },
  {
    key: "live",
    title: "Live Towers",
    description:
      "Conjunto residencial flexible diseñado para vida urbana caribeña. Tipologías eficientes con amenidades de proximidad.",
    image: `${RENDERS_DIR}/live-towers-01.jpg`,
    alt: "Live Towers — render exterior",
  },
];

export default function LarimarIntro() {
  return (
    <section id="larimar-city" className="larimar-intro section--deep">
      <div className="container larimar-intro__grid">
        <Reveal variants={slideLeft} className="larimar-intro__copy">
          <p className="uppercase-tag larimar-intro__tag">Larimar City</p>
          <h2 className="larimar-intro__title">
            Larimar City<br />es más que<br />un proyecto.
          </h2>
          <p className="larimar-intro__body">
            Un nuevo modelo de ciudad-destino en la República Dominicana.
            Residencial, hotelero, cultural y sostenible. Una visión construida
            desde el territorio hacia el mundo.
          </p>
        </Reveal>

        <Reveal variants={slideRight}>
          <div className="larimar-intro__visual">
            <RenderSlider slides={SLIDER_SLIDES} />
          </div>
        </Reveal>
      </div>

      <div className="container larimar-intro__projects-wrap">
        <Reveal>
          <header className="larimar-intro__projects-head">
            <p className="uppercase-tag larimar-intro__projects-tag">Proyectos</p>
            <h3 className="larimar-intro__projects-title">
              Los proyectos<br />que dan vida a la ciudad.
            </h3>
            <p className="larimar-intro__projects-sub">
              Torres residenciales, club de playa, restaurantes y hotelería
              operada con marcas internacionales. Cada pieza diseñada para
              integrarse en un mismo plan maestro.
            </p>
          </header>
        </Reveal>

        <ul className="larimar-intro__projects-grid">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.key} delay={0.04 * i}>
              <li className="larimar-intro__project">
                <div className="larimar-intro__project-image">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                    className="larimar-intro__project-img"
                  />
                </div>
                <h4 className="larimar-intro__project-title">{p.title}</h4>
                <p className="larimar-intro__project-desc">{p.description}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      <div className="container larimar-intro__dream">
        <Reveal variants={slideLeft}>
          <div className="larimar-intro__dream-portrait">
            <Image
              src={images.larimarCommunity}
              alt="Larimar City, vida comunitaria frente al lago"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className="larimar-intro__dream-img"
            />
            <div className="larimar-intro__dream-overlay" aria-hidden="true" />
          </div>
        </Reveal>
        <Reveal variants={slideRight}>
          <div>
            <p className="uppercase-tag larimar-intro__dream-tag">La visión</p>
            <h3 className="larimar-intro__dream-title">
              La construcción<br />de un sueño.
            </h3>
            <p className="larimar-intro__dream-body">
              No hablamos de un desarrollo inmobiliario más. Hablamos de pensar
              cómo queremos que viva la gente en los próximos cincuenta años,
              cómo se integra el proyecto con la comunidad local, cómo se
              respeta y activa el paisaje.
            </p>
            <a href="#contacto" className="btn btn--light larimar-intro__dream-cta">
              Hablemos del proyecto
            </a>
          </div>
        </Reveal>
      </div>

      <style jsx>{`
        .larimar-intro {
          padding-block: var(--section-y);
          scroll-margin-top: 5rem;
        }
        .larimar-intro__grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: clamp(2rem, 6vw, 5rem);
          align-items: center;
        }
        .larimar-intro__tag {
          color: rgba(255,255,255,0.5);
          margin-bottom: 1.5rem;
        }
        .larimar-intro__title {
          font-size: clamp(var(--fs-36), 6vw, var(--fs-68));
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.95;
          margin-block: 0 2rem;
          color: var(--color-white);
          text-wrap: balance;
        }
        .larimar-intro__body {
          color: rgba(255,255,255,0.65);
          font-size: var(--fs-18);
          line-height: 1.6;
          max-width: 42ch;
        }
        .larimar-intro__visual {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #0e1c22;
        }

        /* Projects grid */
        .larimar-intro__projects-wrap {
          padding-top: clamp(4rem, 8vw, 6rem);
        }
        .larimar-intro__projects-head {
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
          max-width: 680px;
        }
        .larimar-intro__projects-tag {
          color: rgba(255,255,255,0.5);
          margin-bottom: 1rem;
        }
        .larimar-intro__projects-title {
          font-size: clamp(var(--fs-30), 5vw, var(--fs-52));
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0 0 1.5rem;
          color: var(--color-white);
        }
        .larimar-intro__projects-sub {
          font-size: var(--fs-18);
          color: rgba(255,255,255,0.65);
          line-height: 1.55;
          max-width: 56ch;
        }
        .larimar-intro__projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem 1.5rem;
        }
        .larimar-intro__project {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .larimar-intro__project-image {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #1a1a18;
          margin-bottom: 0.25rem;
        }
        .larimar-intro__project-image :global(.larimar-intro__project-img) {
          object-fit: cover;
          object-position: center;
          transition: transform 420ms var(--ease-out);
        }
        .larimar-intro__project:hover .larimar-intro__project-image :global(.larimar-intro__project-img) {
          transform: scale(1.04);
        }
        .larimar-intro__project-title {
          font-size: var(--fs-24);
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--color-white);
          margin: 0;
        }
        .larimar-intro__project-desc {
          font-size: var(--fs-15);
          color: rgba(255,255,255,0.65);
          line-height: 1.55;
          margin: 0;
        }

        /* Dream block */
        .larimar-intro__dream {
          padding-top: clamp(3rem, 7vw, 5rem);
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 4rem;
          align-items: center;
        }
        .larimar-intro__dream-portrait {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #0a0a09;
        }
        .larimar-intro__dream-portrait :global(.larimar-intro__dream-img) {
          object-fit: cover;
          object-position: center;
        }
        .larimar-intro__dream-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%);
          pointer-events: none;
        }
        .larimar-intro__dream-tag {
          color: #0CAFFE;
          margin-bottom: 1rem;
        }
        .larimar-intro__dream-title {
          font-size: clamp(var(--fs-36), 5vw, var(--fs-68));
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--color-white);
          margin-bottom: 1.5rem;
        }
        .larimar-intro__dream-body {
          font-size: var(--fs-18);
          color: rgba(255,255,255,0.72);
          line-height: 1.6;
          max-width: 54ch;
          margin-bottom: 2rem;
        }
        @media (max-width: 900px) {
          .larimar-intro__grid { grid-template-columns: 1fr; }
          .larimar-intro__visual { aspect-ratio: 16/10; }
          .larimar-intro__projects-grid { grid-template-columns: repeat(2, 1fr); }
          .larimar-intro__dream { grid-template-columns: 1fr; gap: 2rem; }
        }
        @media (max-width: 560px) {
          .larimar-intro__projects-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
