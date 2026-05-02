"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  /** Si false, affiche la valeur finale sans animation (évite la surcharge de compteurs). */
  animated?: boolean;
}

function formatCounterValue(target: number, decimals: number, prefix: string, suffix: string) {
  const num =
    decimals > 0 ? target.toFixed(decimals) : Math.round(target).toLocaleString("fr-FR");
  return `${prefix}${num}${suffix}`;
}

export default function AnimatedCounter({
  target,
  duration = 1.5,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  animated = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(() =>
    animated ? `${prefix}0${suffix}` : formatCounterValue(target, decimals, prefix, suffix),
  );

  useEffect(() => {
    if (!animated) {
      queueMicrotask(() => {
        setDisplay(formatCounterValue(target, decimals, prefix, suffix));
      });
      return;
    }
    if (!isInView) return;

    const controls = animate(0, target, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate(value) {
        setDisplay(
          `${prefix}${decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("fr-FR")}${suffix}`,
        );
      },
    });

    return () => controls.stop();
  }, [isInView, target, duration, suffix, prefix, decimals, animated]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
