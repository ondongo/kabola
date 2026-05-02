"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Icons } from "@/constants/icons.constants";
import { ROUTES } from "@/constants";
import type { NotificationKind } from "@/types/common.types";
import {
  deleteAllNotificationsForUser,
  deleteNotificationForUser,
  loadMoreNotificationsAction,
  markNotificationRead,
  type NotificationRowSerialized,
} from "@/services/notification.service";

export type NotificationRow = NotificationRowSerialized;

function kindIcon(kind: NotificationKind) {
  switch (kind) {
    case "payment":
      return Icons.dollarSign;
    case "participation":
      return Icons.users;
    case "message":
      return Icons.mail;
    case "verification":
      return Icons.shield;
    case "trust":
      return Icons.star;
    default:
      return Icons.info;
  }
}

export default function NotificationsClient({
  items: initialItems,
  initialNextCursor,
}: {
  items: NotificationRow[];
  initialNextCursor: string | null;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    setItems(initialItems);
    setNextCursor(initialNextCursor);
  }, [initialItems, initialNextCursor]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    const result = await loadMoreNotificationsAction(nextCursor);
    setLoadingMore(false);
    if (result.success && result.data) {
      setItems((prev) => [...prev, ...result.data.items]);
      setNextCursor(result.data.nextCursor);
    }
  }

  async function onOpen(id: string, read: boolean) {
    if (read) return;
    setBusy(id);
    await markNotificationRead(id);
    setBusy(null);
    router.refresh();
  }

  async function onDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    setBusy(id);
    await deleteNotificationForUser(id);
    setBusy(null);
    router.refresh();
  }

  async function onClearAll() {
    if (!items.length) return;
    if (!confirm("Supprimer toutes les notifications ?")) return;
    setClearing(true);
    await deleteAllNotificationsForUser();
    setClearing(false);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text md:text-3xl">Notifications</h1>
        <button
          type="button"
          onClick={() => void onClearAll()}
          disabled={clearing || items.length === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text-muted transition hover:bg-danger-light hover:text-danger disabled:opacity-40"
          aria-label="Tout supprimer"
        >
          <Icons.trash size={20} />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center text-sm text-text-muted">
          Aucune notification pour le moment.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-white shadow-sm">
          {items.map((n) => {
            const Icon = kindIcon(n.kind);
            const href =
              n.data?.subscriptionId != null
                ? ROUTES.SUBSCRIPTION_DETAIL(n.data.subscriptionId)
                : null;

            const body = (
              <>
                <div className="flex shrink-0 items-start pt-0.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Icon size={22} aria-hidden />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-base font-semibold text-text",
                      !n.read && "text-dark-brand",
                    )}
                  >
                    {n.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{n.body}</p>
                  {href ? (
                    <p className="mt-2 text-sm font-semibold text-primary">Voir l’abonnement →</p>
                  ) : null}
                  <p className="mt-3 text-xs text-text-muted">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 text-right">
                  {n.readAt ? (
                    <p className="max-w-[11rem] text-xs text-text-muted">
                      Lu le{" "}
                      {new Date(n.readAt).toLocaleString("fr-FR", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </p>
                  ) : !n.read ? (
                    <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Nouveau
                    </span>
                  ) : null}
                </div>
              </>
            );

            return (
              <li key={n.id} className="flex items-stretch gap-0">
                {href ? (
                  <Link
                    href={href}
                    className="flex min-w-0 flex-1 gap-4 px-4 py-5 transition hover:bg-primary-light/30"
                    onClick={() => void onOpen(n.id, n.read)}
                  >
                    {body}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 gap-4 px-4 py-5 text-left transition hover:bg-primary-light/30"
                    onClick={() => void onOpen(n.id, n.read)}
                  >
                    {body}
                  </button>
                )}
                <div className="flex shrink-0 items-center border-l border-border px-2">
                  <button
                    type="button"
                    onClick={(e) => void onDelete(e, n.id)}
                    disabled={busy === n.id}
                    className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-danger disabled:opacity-50"
                    aria-label="Supprimer cette notification"
                  >
                    <Icons.trash size={18} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {nextCursor && items.length > 0 ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={loadingMore}
            className="rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-text shadow-sm transition hover:bg-surface disabled:opacity-50"
          >
            {loadingMore ? "Chargement…" : "Charger plus"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
