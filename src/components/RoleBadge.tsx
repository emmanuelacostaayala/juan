"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const ROLES = ["ARQ.", "EMP.", "CEO."];

const GRADIENT = "linear-gradient(135deg, #12C9F9 0%, #0CAFFE 50%, #0678FF 100%)";

const SIZES = {
  xs: { dim: 12, fs: 4  },
  sm: { dim: 28, fs: 9  },
  lg: { dim: 100, fs: 30 },
} as const;

export default function RoleBadge({
  size = "sm",
  cycle = true,
}: {
  size?: "xs" | "sm" | "lg";
  cycle?: boolean;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!cycle) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % ROLES.length), 2000);
    return () => clearInterval(id);
  }, [cycle]);

  const { dim, fs } = SIZES[size];

  return (
    <span
      aria-label={`Rol: ${ROLES[idx]}`}
      style={{
        position: "relative",
        display: "inline-flex",
        width: dim,
        height: dim,
        borderRadius: 0,
        background: GRADIENT,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={idx}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "#fff",
            fontSize: fs,
            letterSpacing: "0.04em",
            lineHeight: 1,
            fontFamily: "inherit",
          }}
        >
          {ROLES[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
