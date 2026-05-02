import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildLoginHref } from "@/constants";

export const dynamic = "force-dynamic";
import { getSessionUid } from "@/lib/auth/session";
import {
  listPublicSubscriptionsInitial,
  listSubscriptionsForOwner,
} from "@/services/subscription.service";
import { toSubscriptionListItem } from "@/utils/subscription-list";
import SubscriptionsExploreClient from "./_components/SubscriptionsExploreClient";
import SubscriptionsMineView from "./_components/SubscriptionsMineView";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}): Promise<Metadata> {
  const { view } = await searchParams;
  if (view === "mine") return { title: "Mes abonnements" };
  return { title: "Explorer" };
}

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; q?: string; category?: string }>;
}) {
  const { view, q, category } = await searchParams;

  if (view === "mine") {
    const uid = await getSessionUid();
    if (!uid) {
      redirect(buildLoginHref("/subscriptions?view=mine"));
    }
    const mine = await listSubscriptionsForOwner(uid);
    const items = mine.map(toSubscriptionListItem);
    return <SubscriptionsMineView items={items} />;
  }

  const { items: raw, nextCursor } = await listPublicSubscriptionsInitial();
  const items = raw.map(toSubscriptionListItem);
  return (
    <SubscriptionsExploreClient
      initialItems={items}
      initialNextCursor={nextCursor}
      initialQuery={typeof q === "string" ? q : ""}
      initialCategory={typeof category === "string" ? category : undefined}
    />
  );
}
