"use client";

import { useState } from "react";
import { Reveal, Stagger, fadeUp } from "@/lib/motion";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "¿Qué es Larimar City?",
    a: "Un desarrollo integral en la República Dominicana concebido como ciudad-destino: residencial, hotelero y cultural, con sostenibilidad y conectividad como ejes del proyecto.",
  },
  {
    q: "¿Qué relación tiene con CLERHP?",
    a: "CLERHP es la empresa de ingeniería, construcción y desarrollo inmobiliario que hace posible la ejecución de Larimar City. Opera en cuatro continentes con más de 30 años de trayectoria.",
  },
  {
    q: "¿Cómo se integra la sostenibilidad?",
    a: "Desde la ordenación del territorio hasta la operación del destino: criterios ESG, diseño bioclimático, gestión del agua y la energía, y vínculo con la comunidad local.",
  },
  {
    q: "¿Puedo colaborar o invertir en el proyecto?",
    a: "Sí. El canal de contacto está abierto para inversores institucionales, alianzas estratégicas y profesionales del sector. Escríbenos desde la página de contacto.",
  },
  {
    q: "¿Dónde puedo seguir las publicaciones y apariciones?",
    a: "En la sección Artículos y medios y en mis redes: LinkedIn e Instagram. También puedes suscribirte a la newsletter para recibir reflexiones periódicas.",
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Faqs() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faqs section">
      <div className="container faqs__wrap">
        <Reveal className="faqs__head">
          <p className="uppercase-tag faqs__tag">FAQs</p>
          <h2 className="faqs__title">Preguntas<br />frecuentes.</h2>
        </Reveal>

        <Stagger>
          <ul className="faqs__list">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.li key={item.q} variants={fadeUp} className="faqs__item">
                <button
                  className="faqs__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <motion.span
                    className="faqs__icon"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    aria-hidden="true"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="faqs__a">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
          </ul>
        </Stagger>
      </div>

      <style jsx>{`
        .faqs {
          background: var(--color-white);
          color: var(--color-ink);
          border-top: 1px solid var(--color-cream);
        }
        .faqs__wrap {
          display: grid;
          grid-template-columns: 1fr 1.8fr;
          gap: clamp(2rem, 6vw, 5rem);
          align-items: start;
        }
        .faqs__tag {
          margin-bottom: 1rem;
        }
        .faqs__title {
          font-size: clamp(var(--fs-36), 5vw, var(--fs-68));
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.95;
          margin: 0;
        }
        .faqs__list {
          border-top: 1px solid rgba(25, 25, 23, 0.1);
        }
        .faqs__item {
          border-bottom: 1px solid rgba(25, 25, 23, 0.1);
        }
        .faqs__q {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: 1.5rem 0;
          font-size: var(--fs-18);
          font-weight: 500;
          letter-spacing: -0.01em;
          text-align: left;
          color: inherit;
        }
        .faqs__q:hover { opacity: 0.65; }
        .faqs__icon {
          font-size: var(--fs-24);
          line-height: 1;
          color: var(--color-ink);
          display: inline-block;
          flex-shrink: 0;
        }
        .faqs__a {
          font-size: var(--fs-15);
          line-height: 1.65;
          color: var(--fg-muted);
          max-width: 62ch;
          padding-bottom: 1.5rem;
          padding-right: 3rem;
        }
        @media (max-width: 900px) {
          .faqs__wrap { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
