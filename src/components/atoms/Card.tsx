"use client";

import { cn } from "@/utils/cn";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "glass" | "ring-accent" | "accent";
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6 md:p-8",
};

const variantStyles = {
  default: "bg-white border border-border shadow-sm",
  glass: "glass shadow-sm",
  "ring-accent": "card-ring-accent shadow-sm",
  accent: "bg-primary-light shadow-sm ring-1 ring-primary/10",
};

const fluidEase = [0.16, 1, 0.3, 1] as const;

export default function Card({
  children,
  hover = false,
  padding = "md",
  variant = "default",
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl",
        variantStyles[variant],
        hover && "card-hover-lift cursor-pointer",
        paddingStyles[padding],
        className,
      )}
      whileHover={
        hover
          ? {
              y: -4,
              transition: { duration: 0.35, ease: fluidEase },
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
