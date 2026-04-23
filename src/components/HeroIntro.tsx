"use client";

import { motion } from "framer-motion";
import RoleBadge from "./RoleBadge";

const EASE_IN = [0.16, 1, 0.3, 1] as const;
const EASE_OUT = [0.65, 0, 0.35, 1] as const;

export default function HeroIntro() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.15 } }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "hidden",
      }}
    >
      {/* Content block — animates to top-left on exit */}
      <motion.div
        exit={{
          y: "-46vh",
          scale: 0.09,
          opacity: 0,
          transition: { duration: 0.55, ease: EASE_OUT },
        }}
        style={{
          width: "100%",
          maxWidth: "var(--container-max, 1280px)",
          margin: "0 auto",
          padding: "0 var(--container-gutter, clamp(1rem, 4vw, 2.5rem))",
          transformOrigin: "top left",
        }}
      >
        {/* Tag line */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE_IN }}
          style={{
            fontSize: "clamp(11px, 1.1vw, 14px)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            fontFamily: "var(--font-sans)",
            marginBottom: "clamp(1.25rem, 4vw, 2.5rem)",
          }}
        >
          Construyendo futuro, creando legado.
        </motion.p>

        {/* Name block */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.85, ease: EASE_IN }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* Row 1: JUAN ANDRÉS + badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(10px, 1.4vw, 20px)",
              lineHeight: 0.88,
            }}
          >
            <span className="intro__name">JUAN ANDRÉS</span>
            <RoleBadge size="lg" />
          </div>

          {/* Row 2: ROMERO */}
          <span className="intro__name">ROMERO</span>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        .intro__name {
          display: block;
          font-family: 'NeueHaasDisplay', var(--font-display, sans-serif);
          font-size: clamp(52px, 10vw, 144px);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.88;
          color: #fff;
        }
      `}</style>
    </motion.div>
  );
}
