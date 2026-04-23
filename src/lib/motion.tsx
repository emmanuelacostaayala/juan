"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode, type ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export const staggerFast: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

interface RevealProps {
  children: ReactNode;
  variants?: Variants;
  delay?: number;
  className?: string;
  as?: ElementType;
}

export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const Tag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Tag
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      transition={delay ? { delay } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

interface StaggerProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  as?: ElementType;
}

export function Stagger({ children, variants = staggerContainer, className, as = "div" }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const Tag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Tag
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </Tag>
  );
}

export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionH2 = motion.h2;
export const MotionP = motion.p;
export const MotionLi = motion.li;
