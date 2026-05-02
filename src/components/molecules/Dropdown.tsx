"use client";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

export function Dropdown({
  label,
  children,
  align = "right",
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-text hover:bg-surface"
      >
        {label}
      </button>
      {open ? (
        <div
          className={cn(
            "absolute z-50 mt-1 min-w-[200px] rounded-2xl border border-border bg-white py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
