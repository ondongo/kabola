import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSessionUid } from "@/lib/auth/session";
import {
  listSubscriptionMessagesPage,
  userCanAccessSubscriptionMessages,
} from "@/services/messaging.service";
import { getSubscriptionById } from "@/services/subscription.service";
import { buildLoginHref } from "@/constants";
import ChatPanel from "../_components/ChatPanel";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ subscriptionId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subscriptionId } = await params;
  const sub = await getSubscriptionById(subscriptionId);
  return { title: sub ? `Messages — ${sub.title}` : "Messages" };
}

export default async function MessagesThreadPage({ params }: Props) {
  const { subscriptionId } = await params;
  const uid = await getSessionUid();
  if (!uid) {
    redirect(buildLoginHref(`/messages/${subscriptionId}`));
  }

  const can = await userCanAccessSubscriptionMessages(subscriptionId, uid);
  if (!can) notFound();

  const sub = await getSubscriptionById(subscriptionId);
  if (!sub) notFound();

  const page = await listSubscriptionMessagesPage(subscriptionId);

  return (
    <ChatPanel
      subscriptionId={subscriptionId}
      title={sub.title}
      serviceName={sub.serviceName}
      initialMessages={page.messages}
      initialHasMore={page.hasMore}
      initialOldestCursorId={page.oldestCursorId}
      currentUserId={uid}
    />
  );
}
