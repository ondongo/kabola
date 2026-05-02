"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { COLLECTIONS } from "@/constants/app.constants";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireSessionUid } from "@/lib/auth/session";
import { ROUTES } from "@/constants/routes.constants";
import type { NotificationKind } from "@/types/common.types";
import type { ActionResult } from "@/types/common.types";

export type NotificationRowSerialized = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
  createdAt: string | null;
  readAt: string | null;
  data: Record<string, string> | null;
};

function toSerializedRow(
  raw: Record<string, unknown> & { id: string },
): NotificationRowSerialized {
  const created = raw.createdAt as { toDate?: () => Date } | undefined;
  const readAt = raw.readAt as { toDate?: () => Date } | null | undefined;
  return {
    id: raw.id,
    kind: raw.kind as NotificationKind,
    title: String(raw.title ?? ""),
    body: String(raw.body ?? ""),
    read: Boolean(raw.read),
    createdAt: created?.toDate?.()?.toISOString() ?? null,
    readAt: readAt?.toDate?.()?.toISOString() ?? null,
    data: (raw.data as Record<string, string> | null) ?? null,
  };
}

const NOTIFICATION_PAGE_SIZE = 25;

export async function createNotification(input: {
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  data?: Record<string, string> | null;
}): Promise<void> {
  const db = getAdminDb();
  await db.collection(COLLECTIONS.notifications).add({
    userId: input.userId,
    kind: input.kind,
    title: input.title,
    body: input.body,
    read: false,
    readAt: null,
    data: input.data ?? null,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function listNotificationsPage(
  userId: string,
  options: { limit?: number; cursorDocId?: string | null } = {},
): Promise<{
  items: Array<Record<string, unknown> & { id: string }>;
  nextCursor: string | null;
}> {
  const pageSize = Math.min(options.limit ?? NOTIFICATION_PAGE_SIZE, 100);
  const db = getAdminDb();
  const col = db.collection(COLLECTIONS.notifications);
  let q = col
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(pageSize + 1);
  if (options.cursorDocId) {
    const cur = await col.doc(options.cursorDocId).get();
    if (cur.exists) {
      q = col
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .startAfter(cur)
        .limit(pageSize + 1);
    }
  }
  const snap = await q.get();
  const docs = snap.docs;
  const hasMore = docs.length > pageSize;
  const slice = hasMore ? docs.slice(0, pageSize) : docs;
  const items = slice.map((d) => ({
    id: d.id,
    ...(d.data() as Record<string, unknown>),
  })) as Array<Record<string, unknown> & { id: string }>;
  const nextCursor = hasMore && slice.length > 0 ? slice[slice.length - 1]!.id : null;
  return { items, nextCursor };
}

export async function listNotificationsInitial(userId: string): Promise<{
  items: NotificationRowSerialized[];
  nextCursor: string | null;
}> {
  const { items, nextCursor } = await listNotificationsPage(userId);
  return { items: items.map(toSerializedRow), nextCursor };
}

export async function loadMoreNotificationsAction(
  cursorDocId: string,
): Promise<
  ActionResult<{ items: NotificationRowSerialized[]; nextCursor: string | null }>
> {
  const uid = await requireSessionUid();
  const { items, nextCursor } = await listNotificationsPage(uid, {
    limit: NOTIFICATION_PAGE_SIZE,
    cursorDocId,
  });
  return {
    success: true,
    data: {
      items: items.map(toSerializedRow),
      nextCursor,
    },
  };
}

export async function markNotificationRead(
  notificationId: string,
): Promise<ActionResult<void>> {
  const uid = await requireSessionUid();
  const db = getAdminDb();
  const ref = db.collection(COLLECTIONS.notifications).doc(notificationId);
  const snap = await ref.get();
  if (!snap.exists) {
    return { success: false, error: "Notification introuvable." };
  }
  const row = snap.data() as { userId: string };
  if (row.userId !== uid) {
    return { success: false, error: "Action non autorisée." };
  }
  await ref.update({
    read: true,
    readAt: FieldValue.serverTimestamp(),
  });
  revalidatePath(ROUTES.NOTIFICATIONS);
  return { success: true, data: undefined };
}

export async function markAllNotificationsRead(): Promise<ActionResult<void>> {
  const uid = await requireSessionUid();
  const db = getAdminDb();
  const q = await db
    .collection(COLLECTIONS.notifications)
    .where("userId", "==", uid)
    .get();
  const unread = q.docs.filter((d) => !(d.data() as { read?: boolean }).read);
  if (unread.length === 0) {
    return { success: true, data: undefined };
  }
  const batch = db.batch();
  const now = FieldValue.serverTimestamp();
  unread.forEach((d) => {
    batch.update(d.ref, { read: true, readAt: now });
  });
  await batch.commit();
  revalidatePath(ROUTES.NOTIFICATIONS);
  return { success: true, data: undefined };
}

export async function deleteNotificationForUser(
  notificationId: string,
): Promise<ActionResult<void>> {
  const uid = await requireSessionUid();
  const db = getAdminDb();
  const ref = db.collection(COLLECTIONS.notifications).doc(notificationId);
  const snap = await ref.get();
  if (!snap.exists) {
    return { success: false, error: "Notification introuvable." };
  }
  const row = snap.data() as { userId: string };
  if (row.userId !== uid) {
    return { success: false, error: "Action non autorisée." };
  }
  await ref.delete();
  revalidatePath(ROUTES.NOTIFICATIONS);
  return { success: true, data: undefined };
}

export async function deleteAllNotificationsForUser(): Promise<ActionResult<void>> {
  const uid = await requireSessionUid();
  const db = getAdminDb();
  const q = await db
    .collection(COLLECTIONS.notifications)
    .where("userId", "==", uid)
    .get();
  const batch = db.batch();
  q.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  revalidatePath(ROUTES.NOTIFICATIONS);
  return { success: true, data: undefined };
}
