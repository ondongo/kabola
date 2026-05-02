import { redirect } from "next/navigation";
import { buildLoginHref } from "@/constants";
import { getSessionUid } from "@/lib/auth/session";
import { listMessageThreadsForUser } from "@/services/messaging.service";
import type { MessageThreadSummary } from "@/types/messaging.types";
import MessagesInboxLayout, {
  type ThreadRow,
} from "./_components/MessagesInboxLayout";

function serializeThreads(threads: MessageThreadSummary[]): ThreadRow[] {
  return threads.map((t) => ({
    ...t,
    lastMessage: t.lastMessage
      ? {
          content: t.lastMessage.content,
          senderId: t.lastMessage.senderId,
          createdAt: t.lastMessage.createdAt?.toISOString() ?? null,
        }
      : null,
  }));
}

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const uid = await getSessionUid();
  if (!uid) {
    redirect(buildLoginHref("/messages"));
  }
  const threads = await listMessageThreadsForUser(uid);
  const serialized = serializeThreads(threads);

  return <MessagesInboxLayout threads={serialized}>{children}</MessagesInboxLayout>;
}
