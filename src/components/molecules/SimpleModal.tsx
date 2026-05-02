"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Icons } from "@/constants/icons.constants";
import { cn } from "@/utils/cn";

export interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title: string;
  description?: string;
  /** Modal plus basse et titre plus petit (partage, etc.) */
  compact?: boolean;
}

export function SimpleModal({
  isOpen,
  onClose,
  children,
  title,
  description,
  compact = false,
  className = "w-[min(100vw-2rem,450px)]",
}: SimpleModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Fermer"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="simple-modal-title"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={cn(
              "relative z-10 flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl",
              compact
                ? "max-h-[min(92vh,720px)] max-w-[calc(100vw-2rem)]"
                : "max-h-[min(90vh,640px)] min-h-[min(508px,90vh)]",
              className,
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full shrink-0 flex-row justify-end border-b border-border/80 px-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-text-muted transition hover:bg-surface hover:text-text"
              >
                <Icons.xCircle size={24} aria-hidden />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-4 pb-6 pt-2 md:px-6">
              <div className="flex shrink-0 flex-col gap-2">
                <h2
                  id="simple-modal-title"
                  className={cn(
                    "font-bold leading-snug tracking-tight text-dark-brand",
                    compact ? "text-lg md:text-xl" : "text-xl md:text-2xl",
                  )}
                >
                  {title}
                </h2>
                {description ? (
                  <p
                    className={cn(
                      "leading-relaxed text-text-secondary",
                      compact ? "text-xs" : "text-sm",
                    )}
                  >
                    {description}
                  </p>
                ) : null}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto py-2">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
