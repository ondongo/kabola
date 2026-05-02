import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildLoginHref } from "@/constants";
import { getSessionUid } from "@/lib/auth/session";
import { listNotificationsInitial } from "@/services/notification.service";
import NotificationsClient from "./_components/NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function NotificationsPage() {
  const uid = await getSessionUid();
  if (!uid) {
    redirect(buildLoginHref("/notifications"));
  }
  const { items, nextCursor } = await listNotificationsInitial(uid);

  return <NotificationsClient items={items} initialNextCursor={nextCursor} />;
}
