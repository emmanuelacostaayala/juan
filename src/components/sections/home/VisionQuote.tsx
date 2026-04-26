"use client";

import Image from "next/image";
import { images } from "@/lib/assets";
import { Reveal, Stagger, fadeUp, slideLeft, slideRight } from "@/lib/motion";
import { motion } from "framer-motion";

const STEPS = [
  {
    num: "1",
    title: "Crisis",
    body: "Ante la adversidad, la convicción de que cada obstáculo es el punto de partida de algo más grande.",
  },
  {
    num: "2",
    title: "Reconstrucción",
    body: "El proceso de transformar la visión en acción: equipo, estructura y determinación para ir adelante.",
  },
  {
    num: "3",
    title: "Legado",
    body: "Proyectos que trascienden: territorios transformados, comunidades beneficiadas, historia construida.",
  },
];

export default function VisionQuote() {
  return (
    <section className="vision section--deep">
      <div className="container vision__grid">
        <Reveal variants={slideLeft}>
          <div className="vision__portrait">
            <Image
              src={images.portraitEditorial}
              alt="Juan Andrés Romero, retrato editorial"
              fill
              sizes="(max-width: 800px) 100vw, 40vw"
              className="vision__img"
              quality={90}
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
            <div className="vision__gradient" aria-hidden="true" />
          </div>
        </Reveal>

        <div className="vision__content">
          <Reveal delay={0.1}>
            <p className="uppercase-tag vision__kicker">Historia personal</p>
          </Reveal>
          <Reveal delay={0.15}>
            <h2 className="vision__text">
              Donde otros vieron un final,<br />
              <em>yo encontré un comienzo.</em>
            </h2>
          </Reveal>

          <Stagger className="vision__steps">
            {STEPS.map((s) => (
              <motion.div key={s.num} variants={fadeUp} className="vision__step">
                <span className="vision__step-num">{s.num}</span>
                <div className="vision__step-body">
                  <h3 className="vision__step-title">{s.title}</h3>
                  <p className="vision__step-desc">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>

      <style jsx>{`
        .vision {
          padding-block: clamp(5rem, 12vw, 9rem);
        }
        .vision__grid {
          display: grid;
          grid-template-columns: minmax(280px, 1fr) 1.3fr;
          gap: clamp(2rem, 6vw, 5rem);
          align-items: center;
        }
        .vision__portrait {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--color-black);
        }
        .vision__portrait :global(.vision__img) {
          object-fit: cover;
          object-position: center top;
        }
        .vision__gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(80% 70% at 50% 80%, rgba(0,0,0,0.3) 0%, transparent 60%);
          pointer-events: none;
        }
        .vision__kicker {
          color: rgba(255,255,255,0.45);
          margin-bottom: 1.5rem;
        }
        .vision__text {
          font-family: var(--font-display);
          font-size: clamp(var(--fs-28), 4vw, var(--fs-52));
          line-height: 1.05;
          letter-spacing: -0.03em;
          font-weight: 500;
          color: var(--color-white);
          margin-bottom: 3rem;
          text-wrap: balance;
        }
        .vision__text em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          color: rgba(255,255,255,0.75);
        }
        .vision__steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .vision__step {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .vision__step-num {
          font-size: var(--fs-16);
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          min-width: 1.5rem;
          padding-top: 2px;
        }
        .vision__step-title {
          font-size: var(--fs-20);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-white);
          margin-bottom: 0.35rem;
        }
        .vision__step-desc {
          font-size: var(--fs-15);
          line-height: 1.65;
          color: rgba(255,255,255,0.82);
        }
        @media (max-width: 800px) {
          .vision__grid { grid-template-columns: 1fr; }
          .vision__portrait { aspect-ratio: 5/6; max-width: 460px; }
        }
      `}</style>
    </section>
  );
}
