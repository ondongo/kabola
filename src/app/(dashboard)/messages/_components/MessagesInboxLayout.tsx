"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { Icons } from "@/constants/icons.constants";
import { ROUTES } from "@/constants";
import ServiceIcon from "@/components/atoms/ServiceIcon";
import type { MessageThreadSummary } from "@/types/messaging.types";

export type ThreadRow = Omit<MessageThreadSummary, "lastMessage"> & {
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: string | null;
  } | null;
};

type Props = {
  threads: ThreadRow[];
  children: React.ReactNode;
};

function formatTime(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

export default function MessagesInboxLayout({ threads, children }: Props) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const subscriptionId =
    pathname.startsWith(`${ROUTES.MESSAGES}/`) && pathname !== ROUTES.MESSAGES
      ? pathname.slice(ROUTES.MESSAGES.length + 1).split("/")[0] ?? null
      : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return threads.filter((t) => {
      if (filter === "unread" && !t.unread) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.serviceName.toLowerCase().includes(q)
      );
    });
  }, [threads, query, filter]);

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] bg-section-warm/50 md:min-h-[calc(100vh-5rem)]">
      <aside
        className={cn(
          "flex w-full flex-shrink-0 flex-col border-border bg-white md:max-w-[min(100%,22rem)] md:border-r",
          subscriptionId ? "hidden md:flex" : "flex",
        )}
      >
        <div className="border-b border-border p-3">
          <div className="relative">
            <Icons.search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              size={18}
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un groupe…"
              className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm outline-none ring-primary/0 transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              aria-label="Rechercher une conversation"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["all", "Tout"],
                ["unread", "Non lus"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition",
                  filter === key
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-text-secondary hover:bg-surface",
                )}
              >
                {filter === key ? <Icons.check size={14} aria-hidden /> : null}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-text-muted">
              {threads.length === 0
                ? "Aucune conversation. Rejoignez un groupe ou créez un partage pour échanger ici."
                : "Aucun résultat pour cette recherche."}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((t) => {
                const active = subscriptionId === t.subscriptionId;
                const preview = t.lastMessage?.content?.slice(0, 72) ?? "Pas encore de message.";
                return (
                  <li key={t.subscriptionId}>
                    <Link
                      href={ROUTES.MESSAGES_THREAD(t.subscriptionId)}
                      className={cn(
                        "flex gap-3 px-3 py-3 transition hover:bg-primary-light/40",
                        active && "bg-primary-light/60 ring-2 ring-inset ring-primary/35",
                      )}
                    >
                      <ServiceIcon name={t.serviceName} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-semibold text-text">{t.title}</p>
                          <span
                            className={cn(
                              "shrink-0 text-xs tabular-nums",
                              t.unread
                                ? "font-bold text-primary"
                                : "text-text-muted",
                            )}
                          >
                            {formatTime(t.lastMessage?.createdAt ?? null)}
                          </span>
                        </div>
                        <p className="truncate text-xs text-text-secondary">{t.serviceName}</p>
                        <p
                          className={cn(
                            "mt-0.5 truncate text-sm",
                            t.unread ? "font-semibold text-text" : "text-text-secondary",
                          )}
                        >
                          {preview}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <section
        className={cn(
          "min-h-0 min-w-0 flex-1 flex-col bg-white",
          subscriptionId ? "flex" : "hidden md:flex",
        )}
      >
        {children}
      </section>
    </div>
  );
}
