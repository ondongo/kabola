"use server";

import { FieldValue } from "firebase-admin/firestore";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { COLLECTIONS } from "@/constants/app.constants";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireSessionUid } from "@/lib/auth/session";
import type { ActionResult } from "@/types/common.types";
import type { MessageThreadSummary } from "@/types/messaging.types";
import { ROUTES } from "@/constants/routes.constants";
import { z } from "zod";
import {
  getSubscriptionById,
  listSubscriptionsForOwner,
} from "@/services/subscription.service";
import { listParticipationsForUser } from "@/services/participation.service";

const sendSchema = z.object({
  subscriptionId: z.string().min(8),
  content: z.string().min(1).max(2000),
});

export async function sendSubscriptionMessage(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const uid = await requireSessionUid();
  const parsed = sendSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const db = getAdminDb();
  const subSnap = await db
    .collection(COLLECTIONS.subscriptions)
    .doc(parsed.data.subscriptionId)
    .get();
  if (!subSnap.exists) {
    return { success: false, error: "Abonnement introuvable." };
  }
  const sub = subSnap.data() as { ownerId: string };

  const partSnap = await db
    .collection(COLLECTIONS.participations)
    .where("subscriptionId", "==", parsed.data.subscriptionId)
    .where("userId", "==", uid)
    .where("status", "==", "accepted")
    .limit(1)
    .get();

  const isOwner = sub.ownerId === uid;
  if (!isOwner && partSnap.empty) {
    return { success: false, error: "Vous n’êtes pas autorisé à écrire ici." };
  }

  const msgRef = await db
    .collection(COLLECTIONS.subscriptions)
    .doc(parsed.data.subscriptionId)
    .collection(COLLECTIONS.messages)
    .add({
      senderId: uid,
      content: parsed.data.content,
      isSystem: false,
      createdAt: FieldValue.serverTimestamp(),
    });

  revalidatePath(ROUTES.SUBSCRIPTION_DETAIL(parsed.data.subscriptionId));
  revalidatePath(ROUTES.MESSAGES);
  revalidatePath(ROUTES.MESSAGES_THREAD(parsed.data.subscriptionId));
  return { success: true, data: { id: msgRef.id } };
}

function messageReadDocId(uid: string, subscriptionId: string) {
  return `${uid}_${subscriptionId}`;
}

async function getLastMessageForSubscription(
  subscriptionId: string,
): Promise<{
  content: string;
  senderId: string;
  createdAt: Date | null;
} | null> {
  const db = getAdminDb();
  const ref = db
    .collection(COLLECTIONS.subscriptions)
    .doc(subscriptionId)
    .collection(COLLECTIONS.messages);
  try {
    const snap = await ref.orderBy("createdAt", "desc").limit(1).get();
    if (snap.empty) return null;
    const d = snap.docs[0].data();
    const createdAt =
      (d.createdAt as { toDate?: () => Date } | undefined)?.toDate?.() ?? null;
    return {
      content: String(d.content ?? ""),
      senderId: String(d.senderId ?? ""),
      createdAt,
    };
  } catch {
    const all = await ref.get();
    if (all.empty) return null;
    type Row = { id: string } & Record<string, unknown>;
    const sorted = all.docs
      .map((doc): Row => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }))
      .sort((a, b) => {
        const ta = (a.createdAt as { toMillis?: () => number })?.toMillis?.() ?? 0;
        const tb = (b.createdAt as { toMillis?: () => number })?.toMillis?.() ?? 0;
        return tb - ta;
      });
    const d = sorted[0];
    const createdAt =
      (d.createdAt as { toDate?: () => Date } | undefined)?.toDate?.() ?? null;
    return {
      content: String(d.content ?? ""),
      senderId: String(d.senderId ?? ""),
      createdAt,
    };
  }
}

async function getMessageLastReadMs(
  uid: string,
  subscriptionId: string,
): Promise<number> {
  const db = getAdminDb();
  const snap = await db
    .collection(COLLECTIONS.messageReads)
    .doc(messageReadDocId(uid, subscriptionId))
    .get();
  if (!snap.exists) return 0;
  const t = snap.data()?.lastReadAt as { toMillis?: () => number } | undefined;
  return t?.toMillis?.() ?? 0;
}

/** Liste des fils accessibles (hôte ou participant accepté), triés par activité. */
export async function listMessageThreadsForUser(
  uid: string,
): Promise<MessageThreadSummary[]> {
  const ownerSubs = await listSubscriptionsForOwner(uid);
  const parts = await listParticipationsForUser(uid);
  const accepted = parts.filter((p) => p.status === "accepted");
  const ids = new Set<string>();
  ownerSubs.forEach((s) => ids.add(s.id));
  accepted.forEach((p) => ids.add(p.subscriptionId));

  const threads: MessageThreadSummary[] = [];

  for (const subscriptionId of ids) {
    const sub = await getSubscriptionById(subscriptionId);
    if (!sub || sub.status !== "active") continue;

    const last = await getLastMessageForSubscription(subscriptionId);
    /** Pas de fil « vide » dans la liste : uniquement après un vrai échange. */
    if (!last) continue;

    const readMs = await getMessageLastReadMs(uid, subscriptionId);
    const lastMs = last?.createdAt?.getTime() ?? 0;
    const unread = lastMs > 0 && (readMs === 0 || lastMs > readMs);

    const sortKeyMs = lastMs;

    threads.push({
      subscriptionId,
      title: sub.title,
      serviceName: sub.serviceName,
      category: sub.category,
      lastMessage: last,
      unread,
      sortKeyMs,
    });
  }

  threads.sort((a, b) => b.sortKeyMs - a.sortKeyMs);
  return threads;
}

export async function markSubscriptionMessagesRead(
  subscriptionId: string,
): Promise<ActionResult<void>> {
  const uid = await requireSessionUid();
  const ok = await userCanAccessSubscriptionMessages(subscriptionId, uid);
  if (!ok) {
    return { success: false, error: "Accès refusé." };
  }
  const db = getAdminDb();
  await db
    .collection(COLLECTIONS.messageReads)
    .doc(messageReadDocId(uid, subscriptionId))
    .set(
      {
        userId: uid,
        subscriptionId,
        lastReadAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  revalidatePath(ROUTES.MESSAGES);
  revalidatePath(ROUTES.MESSAGES_THREAD(subscriptionId));
  return { success: true, data: undefined };
}

export async function userCanAccessSubscriptionMessages(
  subscriptionId: string,
  uid: string,
): Promise<boolean> {
  const db = getAdminDb();
  const subSnap = await db.collection(COLLECTIONS.subscriptions).doc(subscriptionId).get();
  if (!subSnap.exists) return false;
  const sub = subSnap.data() as { ownerId: string };
  if (sub.ownerId === uid) return true;
  const partSnap = await db
    .collection(COLLECTIONS.participations)
    .where("subscriptionId", "==", subscriptionId)
    .where("userId", "==", uid)
    .where("status", "==", "accepted")
    .limit(1)
    .get();
  return !partSnap.empty;
}

const MESSAGE_PAGE_SIZE = 35;

export type SubscriptionMessageRow = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string | null;
};

function serializeMessageDoc(d: QueryDocumentSnapshot): SubscriptionMessageRow {
  const data = d.data();
  const createdAt =
    (data.createdAt as { toDate?: () => Date } | undefined)?.toDate?.()?.toISOString() ??
    null;
  return {
    id: d.id,
    senderId: String(data.senderId ?? ""),
    content: String(data.content ?? ""),
    createdAt,
  };
}

/**
 * Messages du fil, du plus ancien au plus récent dans le tableau retourné.
 * `startAfterDocId` = id du message le plus ancien déjà chargé (pour charger les suivants, plus vieux).
 */
export async function listSubscriptionMessagesPage(
  subscriptionId: string,
  options: { limit?: number; startAfterDocId?: string | null } = {},
): Promise<{
  messages: SubscriptionMessageRow[];
  hasMore: boolean;
  oldestCursorId: string | null;
}> {
  const pageSize = Math.min(options.limit ?? MESSAGE_PAGE_SIZE, 100);
  const db = getAdminDb();
  const ref = db
    .collection(COLLECTIONS.subscriptions)
    .doc(subscriptionId)
    .collection(COLLECTIONS.messages);

  try {
    let q = ref.orderBy("createdAt", "desc").limit(pageSize + 1);
    if (options.startAfterDocId) {
      const snap = await ref.doc(options.startAfterDocId).get();
      if (snap.exists) {
        q = ref.orderBy("createdAt", "desc").startAfter(snap).limit(pageSize + 1);
      }
    }
    const snap = await q.get();
    const docs = snap.docs;
    const hasMore = docs.length > pageSize;
    const slice = hasMore ? docs.slice(0, pageSize) : docs;
    const chronological = [...slice].reverse().map(serializeMessageDoc);
    const oldestCursorId =
      chronological.length > 0 ? chronological[0]!.id : null;
    return { messages: chronological, hasMore, oldestCursorId };
  } catch {
    const all = await ref.get();
    type Row = Record<string, unknown> & { id: string };
    const rows = all.docs.map(
      (d): Row => ({ id: d.id, ...(d.data() as Record<string, unknown>) }),
    );
    rows.sort((a, b) => {
      const ta = (a.createdAt as { toMillis?: () => number })?.toMillis?.() ?? 0;
      const tb = (b.createdAt as { toMillis?: () => number })?.toMillis?.() ?? 0;
      return tb - ta;
    });
    let sliceStart = 0;
    if (options.startAfterDocId) {
      const pos = rows.findIndex((r) => r.id === options.startAfterDocId);
      if (pos < 0) {
        return { messages: [], hasMore: false, oldestCursorId: null };
      }
      sliceStart = pos + 1;
    }
    const window = rows.slice(sliceStart, sliceStart + pageSize + 1);
    const hasMore = window.length > pageSize;
    const page = hasMore ? window.slice(0, pageSize) : window;
    const chronological = [...page].reverse();
    const messages: SubscriptionMessageRow[] = chronological.map((m) => ({
      id: m.id,
      senderId: String(m.senderId ?? ""),
      content: String(m.content ?? ""),
      createdAt:
        (m.createdAt as { toDate?: () => Date } | undefined)?.toDate?.()?.toISOString() ??
        null,
    }));
    const oldestCursorId = messages.length > 0 ? messages[0]!.id : null;
    return { messages, hasMore, oldestCursorId };
  }
}

export async function loadOlderSubscriptionMessagesAction(
  subscriptionId: string,
  startAfterDocId: string,
): Promise<
  ActionResult<{
    messages: SubscriptionMessageRow[];
    hasMore: boolean;
    oldestCursorId: string | null;
  }>
> {
  const uid = await requireSessionUid();
  const ok = await userCanAccessSubscriptionMessages(subscriptionId, uid);
  if (!ok) {
    return { success: false, error: "Accès refusé." };
  }
  const page = await listSubscriptionMessagesPage(subscriptionId, {
    limit: MESSAGE_PAGE_SIZE,
    startAfterDocId,
  });
  return { success: true, data: page };
}
