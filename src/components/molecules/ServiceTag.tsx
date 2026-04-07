"use client";

import { cn } from "@/utils/cn";

interface ServiceTagProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function ServiceTag({
  label,
  isActive = false,
  onClick,
}: ServiceTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
        isActive
          ? "bg-primary text-white"
          : "bg-surface text-text-secondary hover:bg-gray-200",
      )}
    >
      {label}
    </button>
  );
}
