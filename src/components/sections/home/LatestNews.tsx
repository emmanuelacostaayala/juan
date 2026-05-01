"use client";

import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/assets";
import { Reveal, Stagger, fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";

const POSTS = [
  {
    tag: "Análisis · Estrategias de Inversión",
    title: "Clerhp se prepara para 2026 con un balance sólido, preventas al alza y una marca más visible",
    date: "Marzo 2026",
    href: "https://www.estrategiasdeinversion.com/analisis/bolsa-y-mercados/el-experto-opina/clerhp-se-prepara-para-2026-con-un-balance-solido-n-862849",
    image: images.portraitExpoTalk,
    imgAlt: "Juan Andrés Romero, presidente de Clerhp",
  },
  {
    tag: "Reportaje · Murcia Diario",
    title: "Larimar City & Resort entra en el porfolio de inversión internacional de República Dominicana",
    date: "Junio 2025",
    href: "https://www.murciadiario.com/articulo/empresas/larimar-triuf/20250613112354128802.html",
    image: images.larimarCommunity,
    imgAlt: "Larimar City, vista del territorio",
  },
  {
    tag: "Vídeo · Estrategias de Inversión",
    title: "El megaproyecto Larimar dispara las oportunidades de crecimiento de Clerhp",
    date: "Marzo 2025",
    href: "https://www.youtube.com/watch?v=7_62UxU11pM",
    image: images.portraitConstruction,
    imgAlt: "Entrevista en vídeo a Juan Andrés Romero",
  },
];

export default function LatestNews() {
  return (
    <section className="latest section">
      <div className="container">
        <div className="latest__head">
          <Reveal>
            <p className="uppercase-tag latest__tag">Lo último</p>
            <h2 className="latest__title">Reflexiones y apariciones.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/#articulos-y-medios" className="latest__all">
              Ver todo →
            </Link>
          </Reveal>
        </div>

        <Stagger>
          <div className="latest__grid">
            {POSTS.map((p) => (
              <motion.div key={p.title} variants={fadeUp}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="latest__card"
                >
                  <div className="latest__cover">
                    <Image
                      src={p.image}
                      alt={p.imgAlt}
                      fill
                      sizes="(max-width: 900px) 100vw, 30vw"
                      className="latest__img"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                  </div>
                  <div className="latest__body">
                    <span className="latest__meta">{p.tag} · {p.date}</span>
                    <h3 className="latest__card-title">{p.title}</h3>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </Stagger>
      </div>

      <style jsx>{`
        .latest {
          background: var(--color-white);
          color: var(--color-ink);
        }
        .latest__head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .latest__tag {
          margin-bottom: 0.75rem;
        }
        .latest__title {
          font-size: clamp(var(--fs-30), 4vw, var(--fs-52));
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0;
        }
        .latest__all {
          font-size: var(--fs-14);
          font-weight: 500;
          color: var(--fg-muted);
          transition: color 180ms var(--ease-out);
          white-space: nowrap;
        }
        .latest__all:hover { color: var(--color-ink); }
        .latest__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .latest__card {
          display: flex;
          flex-direction: column;
          color: inherit;
        }
        .latest__cover {
          position: relative;
          aspect-ratio: 4/3;
          background: var(--color-cream);
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          overflow: hidden;
        }
        .latest__cover :global(.latest__img) {
          object-fit: cover;
          object-position: center;
          transition: transform 400ms var(--ease-out);
        }
        .latest__card:hover .latest__cover :global(.latest__img) {
          transform: scale(1.05);
        }
        .latest__body {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .latest__meta {
          font-size: var(--fs-13);
          color: var(--fg-muted);
          letter-spacing: 0.04em;
        }
        .latest__card-title {
          font-size: var(--fs-20);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0;
          transition: opacity 180ms var(--ease-out);
        }
        .latest__card:hover .latest__card-title { opacity: 0.6; }
        @media (max-width: 900px) {
          .latest__grid { grid-template-columns: 1fr; }
          .latest__head { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </section>
  );
}
