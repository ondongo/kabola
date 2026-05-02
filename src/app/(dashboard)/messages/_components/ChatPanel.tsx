"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import { Icons } from "@/constants/icons.constants";
import { APP_NAME, ROUTES } from "@/constants";
import {
  loadOlderSubscriptionMessagesAction,
  markSubscriptionMessagesRead,
  sendSubscriptionMessage,
} from "@/services/messaging.service";
import ServiceIcon from "@/components/atoms/ServiceIcon";
import Avatar from "@/components/atoms/Avatar";

type Msg = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string | null;
};

type Props = {
  subscriptionId: string;
  title: string;
  serviceName: string;
  initialMessages: Msg[];
  initialHasMore: boolean;
  initialOldestCursorId: string | null;
  currentUserId: string;
};

export default function ChatPanel({
  subscriptionId,
  title,
  serviceName,
  initialMessages,
  initialHasMore,
  initialOldestCursorId,
  currentUserId,
}: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [hasMoreOlder, setHasMoreOlder] = useState(initialHasMore);
  const [oldestCursorId, setOldestCursorId] = useState(initialOldestCursorId);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages(initialMessages);
    setHasMoreOlder(initialHasMore);
    setOldestCursorId(initialOldestCursorId);
  }, [initialMessages, initialHasMore, initialOldestCursorId]);

  async function loadOlder() {
    if (!oldestCursorId || loadingOlder || !hasMoreOlder) return;
    setLoadingOlder(true);
    setError(null);
    const result = await loadOlderSubscriptionMessagesAction(
      subscriptionId,
      oldestCursorId,
    );
    setLoadingOlder(false);
    if (!result.success) {
      setError(
        typeof result.error === "string"
          ? result.error
          : "Impossible de charger les messages.",
      );
      return;
    }
    const { messages: older, hasMore, oldestCursorId: nextOldest } = result.data;
    setMessages((prev) => [...older, ...prev]);
    setHasMoreOlder(hasMore);
    setOldestCursorId(nextOldest);
  }

  useEffect(() => {
    void markSubscriptionMessagesRead(subscriptionId);
  }, [subscriptionId]);

  async function send() {
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    setError(null);
    const result = await sendSubscriptionMessage({
      subscriptionId,
      content,
    });
    setSending(false);
    if (!result.success) {
      setError(
        typeof result.error === "string"
          ? result.error
          : "Impossible d’envoyer le message.",
      );
      return;
    }
    setText("");
    setMessages((prev) => [
      ...prev,
      {
        id: result.data.id,
        senderId: currentUserId,
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
    router.refresh();
  }

  return (
    <div className="flex h-full min-h-[50vh] flex-col md:min-h-[calc(100vh-5rem)]">
      <header className="flex items-center gap-3 border-b border-border bg-white px-3 py-3 md:px-4">
        <Link
          href={ROUTES.MESSAGES}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface text-text md:hidden"
          aria-label="Retour à la liste"
        >
          <Icons.arrowLeft size={20} />
        </Link>
        <ServiceIcon name={serviceName} size="md" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold text-text">{title}</h1>
          <p className="truncate text-xs text-text-secondary">{serviceName}</p>
        </div>
        <Link
          href={ROUTES.SUBSCRIPTION_DETAIL(subscriptionId)}
          className="hidden rounded-lg px-2 py-1.5 text-xs font-medium text-primary hover:bg-primary-light/50 sm:inline"
        >
          Fiche abo
        </Link>
      </header>

      <div className="flex items-start gap-2 border-b border-accent-medium/40 bg-accent/50 px-3 py-2.5 text-xs text-text-secondary md:px-4">
        <Icons.info className="mt-0.5 shrink-0 text-primary" size={16} aria-hidden />
        <p>
          Échangez les infos utiles au partage (invitations, consignes). Ne partagez pas vos
          coordonnées bancaires ici — les paiements passent par {APP_NAME}. Préférez les
          invitations officielles aux mots de passe en clair.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4 md:px-4">
        {hasMoreOlder && oldestCursorId ? (
          <div className="flex justify-center pb-1">
            <button
              type="button"
              onClick={() => void loadOlder()}
              disabled={loadingOlder}
              className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-text-secondary shadow-sm transition hover:bg-surface disabled:opacity-50"
            >
              {loadingOlder ? "Chargement…" : "Messages plus anciens"}
            </button>
          </div>
        ) : null}
        {messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-muted">
            Aucun message pour le moment. Écrivez le premier message ci-dessous.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === currentUserId;
            return (
              <div
                key={m.id}
                className={`flex gap-2 ${mine ? "justify-end" : "justify-start"}`}
              >
                {!mine ? (
                  <Avatar alt="Participant" src={null} size="sm" className="mt-0.5" />
                ) : null}
                <div
                  className={`max-w-[min(100%,28rem)] rounded-2xl px-4 py-2.5 text-sm ${
                    mine
                      ? "bg-primary text-white shadow-sm"
                      : "border border-border bg-white text-text shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.createdAt ? (
                    <p
                      className={`mt-1 text-[10px] ${
                        mine ? "text-white/75" : "text-text-muted"
                      }`}
                    >
                      {new Date(m.createdAt).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {error ? <p className="px-3 text-center text-sm text-danger md:px-4">{error}</p> : null}

      <div className="border-t border-border bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-surface/80 p-1.5 pl-3 shadow-inner">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écrivez votre message…"
            rows={2}
            className="min-h-[44px] flex-1 resize-none bg-transparent py-2.5 text-sm outline-none placeholder:text-text-muted"
            maxLength={2000}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <Button
            type="button"
            className="mb-1 shrink-0 rounded-xl bg-primary px-3 py-2.5 text-white hover:bg-primary-hover"
            disabled={!text.trim() || sending}
            isLoading={sending}
            onClick={() => void send()}
            aria-label="Envoyer"
          >
            <Icons.arrowRight size={20} className="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
