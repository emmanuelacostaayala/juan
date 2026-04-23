"use client";

import Image from "next/image";
import { images } from "@/lib/assets";
import { Reveal, slideLeft, slideRight } from "@/lib/motion";
import GradientSquare from "@/components/GradientSquare";

const PILLARS = [
  { key: "Conexión", desc: "Infraestructura que conecta el destino con el mundo.", image: images.santoDomingoView, alt: "Vista aérea de Santo Domingo" },
  { key: "Vivir", desc: "Residencial diseñado para vivir, no sólo para comprar.", image: images.larimarTower, alt: "Torre residencial de Larimar City" },
  { key: "Montaña", desc: "Integración con el paisaje y la geografía local.", image: images.larimarDay, alt: "Larimar City vista aérea diurna" },
  { key: "Playa", desc: "Litoral protegido, accesible y activo todo el año.", image: images.dominicanBeach, alt: "Playa dominicana" },
  { key: "Comunidad", desc: "Equipamientos culturales y sociales en el corazón del destino.", image: images.larimarPergola, alt: "Amenity exterior con pergola" },
  { key: "Sostenibilidad", desc: "Criterios ESG en cada fase del proyecto.", image: images.larimarAmenity, alt: "Larimar City amenidad sostenible" },
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
            <Image
              src={images.larimarNight}
              alt="Larimar City — vista aérea nocturna con luna y piscinas"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className="larimar-intro__image"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </Reveal>
      </div>

      <div className="container larimar-intro__pillars-wrap">
        <ul className="larimar-intro__pillars">
          {PILLARS.map((p, i) => (
            <Reveal key={p.key} delay={0.05 * i}>
              <li className="larimar-intro__pillar">
                <div className="larimar-intro__pillar-image">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 30vw"
                    className="larimar-intro__pillar-img"
                  />
                  <GradientSquare size={16} className="larimar-intro__pillar-n" />
                </div>
                <h3 className="larimar-intro__pillar-key">{p.key}</h3>
                <p className="larimar-intro__pillar-desc">{p.desc}</p>
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
        .larimar-intro__visual :global(.larimar-intro__image) {
          object-fit: cover;
          object-position: center;
          transition: transform 600ms var(--ease-out);
        }
        .larimar-intro__visual:hover :global(.larimar-intro__image) {
          transform: scale(1.04);
        }
        .larimar-intro__pillars-wrap {
          padding-top: clamp(3rem, 7vw, 5rem);
        }
        .larimar-intro__pillars {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .larimar-intro__pillar {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .larimar-intro__pillar-image {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #1a1a18;
          display: flex;
          align-items: flex-start;
          padding: 1rem;
          margin-bottom: 0.5rem;
        }
        .larimar-intro__pillar-image :global(.larimar-intro__pillar-img) {
          object-fit: cover;
          object-position: center;
          z-index: 0;
          transition: transform 420ms var(--ease-out);
        }
        .larimar-intro__pillar:hover .larimar-intro__pillar-image :global(.larimar-intro__pillar-img) {
          transform: scale(1.04);
        }
        .larimar-intro__pillar-image :global(.larimar-intro__pillar-n) {
          position: relative;
          z-index: 1;
        }
        .larimar-intro__pillar-key {
          font-size: var(--fs-24);
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--color-white);
        }
        .larimar-intro__pillar-desc {
          font-size: var(--fs-15);
          color: rgba(255,255,255,0.65);
          line-height: 1.5;
        }
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
          color: var(--color-accent);
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
          .larimar-intro__pillars { grid-template-columns: repeat(2, 1fr); }
          .larimar-intro__dream { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .larimar-intro__pillars { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
