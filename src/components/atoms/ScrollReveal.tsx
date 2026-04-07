"use client";

import { motion, type TargetAndTransition } from "framer-motion";
import type { ReactNode } from "react";

type RevealVariant =
  | "fade-up"
  | "fade-left"
  | "fade-right"
  | "scale-in"
  | "blur-up"
  | "rotate-in"
  | "slide-up-spring";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const hidden: Record<RevealVariant, TargetAndTransition> = {
  "fade-up": { opacity: 0, y: 36 },
  "fade-left": { opacity: 0, x: -36 },
  "fade-right": { opacity: 0, x: 36 },
  "scale-in": { opacity: 0, scale: 0.94 },
  "blur-up": { opacity: 0, y: 28 },
  "rotate-in": { opacity: 0, y: 20 },
  "slide-up-spring": { opacity: 0, y: 40 },
};

const visible: Record<RevealVariant, TargetAndTransition> = {
  "fade-up": { opacity: 1, y: 0 },
  "fade-left": { opacity: 1, x: 0 },
  "fade-right": { opacity: 1, x: 0 },
  "scale-in": { opacity: 1, scale: 1 },
  "blur-up": { opacity: 1, y: 0 },
  "rotate-in": { opacity: 1, y: 0 },
  "slide-up-spring": { opacity: 1, y: 0 },
};

type CubicBezier = [number, number, number, number];

const defaultEase: CubicBezier = [0.16, 1, 0.3, 1];
const easings: Partial<Record<RevealVariant, CubicBezier>> = {
  "slide-up-spring": [0.16, 1, 0.3, 1],
};

export default function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.7,
  className,
  once = true,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={hidden[variant]}
      whileInView={visible[variant]}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: easings[variant] ?? defaultEase,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
