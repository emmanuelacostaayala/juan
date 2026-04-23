"use client";

import Image from "next/image";
import { images } from "@/lib/assets";
import { Reveal, slideLeft } from "@/lib/motion";
import GradientSquare from "@/components/GradientSquare";

const VALUES = [
  {
    n: "01",
    title: "Integridad",
    body: "Cumplir lo que se dice. En cada decisión, en cada contrato, en cada persona que confía.",
  },
  {
    n: "02",
    title: "Visión",
    body: "Ver más allá del próximo ciclo. Planificar territorios, no solo edificios.",
  },
  {
    n: "03",
    title: "Equipo",
    body: "Los grandes proyectos se construyen con personas. Cuidamos a los nuestros.",
  },
  {
    n: "04",
    title: "Sostenibilidad",
    body: "Responsabilidad con el entorno, la comunidad y las siguientes generaciones.",
  },
];

export default function AboutJAR() {
  return (
    <section id="sobre-mi" className="about section">
      <div className="container about__grid">
        <Reveal variants={slideLeft}>
          <div className="about__visual-wrap">
            <Image
              src={images.portraitTallNavy}
              alt="Juan Andrés Romero — retrato"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className="about__img"
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
        </Reveal>

        <div className="about__copy">
          <Reveal>
            <p className="uppercase-tag about__tag">Sobre mí</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="about__title">
              Soy Juan Andrés Romero, presidente de CLERHP y creador de Larimar City.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="about__lead">
              Mi propósito es construir proyectos que transformen territorios y generen impacto real.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="about__body">
              Arquitecto, empresario y presidente de CLERHP. Llevo más de tres
              décadas convirtiendo visiones en infraestructuras que perduran.
              Lidero desde la integridad, la visión y la convicción de que los
              grandes sueños se construyen paso a paso, con valores y equipo.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="container about__values">
        <Reveal>
          <header className="about__values-head">
            <p className="uppercase-tag about__values-tag">Principios</p>
            <h3 className="about__values-title">Lo que guía cada proyecto.</h3>
          </header>
        </Reveal>
        <ul className="about__values-grid">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={0.05 * i}>
              <li className="about__values-item">
                <GradientSquare size={14} />
                <h4 className="about__values-item-title">{v.title}</h4>
                <p className="about__values-item-body">{v.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .about {
          background: var(--color-white);
          color: var(--color-ink);
          scroll-margin-top: 5rem;
        }
        .about__grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: clamp(2.5rem, 7vw, 6rem);
          align-items: center;
        }
        .about__visual-wrap {
          position: relative;
          aspect-ratio: 2/3;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #e5e5e5;
        }
        .about__visual-wrap :global(.about__img) {
          object-fit: cover;
          object-position: center top;
        }
        .about__tag {
          margin-bottom: 1.5rem;
        }
        .about__title {
          font-size: clamp(var(--fs-28), 3.8vw, var(--fs-52));
          font-weight: 500;
          letter-spacing: -0.03em;
          line-height: 1.05;
          text-wrap: balance;
          margin-bottom: 1.75rem;
        }
        .about__lead {
          font-size: clamp(var(--fs-20), 2vw, var(--fs-28));
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.3;
          color: var(--color-ink);
          margin-bottom: 1.25rem;
          text-wrap: balance;
        }
        .about__body {
          font-size: var(--fs-15);
          line-height: 1.65;
          color: var(--fg-muted);
          max-width: 46ch;
        }
        .about__values {
          padding-top: clamp(3rem, 7vw, 5rem);
        }
        .about__values-head {
          margin-bottom: 3rem;
          max-width: 600px;
        }
        .about__values-tag {
          color: var(--color-accent);
          margin-bottom: 1rem;
        }
        .about__values-title {
          font-size: clamp(var(--fs-30), 4vw, var(--fs-52));
          font-weight: 500;
          letter-spacing: -0.03em;
          line-height: 1;
          margin: 0;
        }
        .about__values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }
        .about__values-item {
          padding-top: 1.5rem;
          border-top: 1px solid rgba(25, 25, 23, 0.14);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .about__values-item-title {
          font-size: var(--fs-24);
          font-weight: 500;
          letter-spacing: -0.02em;
        }
        .about__values-item-body {
          font-size: var(--fs-15);
          color: var(--fg-muted);
          line-height: 1.5;
        }
        @media (max-width: 900px) {
          .about__grid {
            grid-template-columns: 1fr;
          }
          .about__visual-wrap {
            aspect-ratio: 4/3;
            max-height: 420px;
          }
          .about__values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 560px) {
          .about__values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
