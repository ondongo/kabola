"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";

type Tab = { id: string; label: string; content: React.ReactNode };

export function Tabs({ tabs, defaultId }: { tabs: Tab[]; defaultId?: string }) {
  const [active, setActive] = useState(defaultId ?? tabs[0]?.id ?? "");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto rounded-2xl bg-surface p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={cn(
              "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              active === t.id
                ? "bg-white text-primary shadow-sm"
                : "text-text-secondary hover:text-text",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{current?.content}</div>
    </div>
  );
}
