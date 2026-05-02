import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";
import { getSubscriptionById } from "@/services/subscription.service";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const sub = await getSubscriptionById(id);
  return { title: sub ? `Messages — ${sub.title}` : "Messages" };
}

/** Ancienne URL : redirige vers le hub Messages. */
export default async function SubscriptionMessagesRedirect({ params }: Props) {
  const { id } = await params;
  redirect(ROUTES.MESSAGES_THREAD(id));
}
