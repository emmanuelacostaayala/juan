"use client";

import { Reveal, Stagger, fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import GradientSquare from "@/components/GradientSquare";

const PILLARS = [
  {
    num: "01",
    title: "Solidez",
    sub: "Talento y transformación",
    body: "Un grupo empresarial construido sobre décadas de obra ejecutada, rigor técnico y equipos comprometidos con cada proyecto.",
  },
  {
    num: "02",
    title: "Historia",
    sub: "Crecimiento constante",
    body: "Más de 30 años de trayectoria en cuatro continentes, con una metodología que convierte la visión en estructura real.",
  },
  {
    num: "03",
    title: "Propósito",
    sub: "La construcción de un sueño",
    body: "Cada proyecto de CLERHP tiene un objetivo más profundo: transformar territorios y generar impacto duradero en las comunidades.",
  },
];

export default function ClerhpBlock() {
  return (
    <section id="clerhp" className="clerhp section">
      <div className="container">
        <Reveal>
          <div className="clerhp__head">
            <p className="uppercase-tag clerhp__tag">CLERHP</p>
            <h2 className="clerhp__title">Clerhp</h2>
            <p className="clerhp__sub">(driving development)</p>
          </div>
        </Reveal>

        <Stagger>
          <div className="clerhp__pillars">
            {PILLARS.map((p) => (
              <motion.div key={p.num} variants={fadeUp} className="clerhp__pillar">
                <div className="clerhp__pillar-top">
                  <GradientSquare size={18} />
                  <div className="clerhp__divider" />
                </div>
                <h3 className="clerhp__pillar-title">{p.title}</h3>
                <p className="clerhp__pillar-sub">{p.sub}</p>
                <p className="clerhp__pillar-body">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </Stagger>
      </div>

      <style jsx>{`
        .clerhp {
          background: var(--color-white);
          color: var(--color-ink);
          border-top: 1px solid var(--color-cream);
          scroll-margin-top: 5rem;
        }
        .clerhp__head {
          margin-bottom: clamp(3rem, 7vw, 5.5rem);
        }
        .clerhp__tag {
          margin-bottom: 1rem;
        }
        .clerhp__title {
          font-size: clamp(var(--fs-52), 8vw, 7rem);
          font-weight: 500;
          letter-spacing: -0.05em;
          line-height: 0.9;
          margin-bottom: 0.5rem;
        }
        .clerhp__sub {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(var(--fs-18), 2vw, var(--fs-24));
          color: var(--fg-muted);
          letter-spacing: 0;
          font-weight: 400;
        }
        .clerhp__pillars {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border-top: 1px solid rgba(25, 25, 23, 0.12);
        }
        .clerhp__pillar {
          padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2.5rem) clamp(1.5rem, 4vw, 3rem) 0;
          border-right: 1px solid rgba(25, 25, 23, 0.12);
        }
        .clerhp__pillar:last-child {
          border-right: none;
          padding-left: clamp(1rem, 3vw, 2.5rem);
        }
        .clerhp__pillar:nth-child(2) {
          padding-left: clamp(1rem, 3vw, 2.5rem);
        }
        .clerhp__pillar-top {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .clerhp__num {
          font-size: clamp(var(--fs-28), 3vw, var(--fs-36));
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--color-ink);
        }
        .clerhp__divider {
          flex: 1;
          height: 1px;
          background: rgba(25, 25, 23, 0.12);
        }
        .clerhp__pillar-title {
          font-size: clamp(var(--fs-24), 2.5vw, var(--fs-30));
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1;
          margin-bottom: 0.4rem;
        }
        .clerhp__pillar-sub {
          font-size: var(--fs-15);
          font-weight: 500;
          color: var(--fg-muted);
          margin-bottom: 1.25rem;
        }
        .clerhp__pillar-body {
          font-size: var(--fs-14);
          line-height: 1.6;
          color: var(--fg-muted);
          max-width: 34ch;
        }
        @media (max-width: 800px) {
          .clerhp__pillars {
            grid-template-columns: 1fr;
          }
          .clerhp__pillar {
            border-right: none;
            border-bottom: 1px solid rgba(25, 25, 23, 0.12);
            padding: 2rem 0;
          }
          .clerhp__pillar:last-child {
            border-bottom: none;
            padding-left: 0;
          }
          .clerhp__pillar:nth-child(2) {
            padding-left: 0;
          }
        }
      `}</style>
    </section>
  );
}
