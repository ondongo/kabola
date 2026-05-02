"use server";

import { FieldValue } from "firebase-admin/firestore";
import { COLLECTIONS, MAX_TRUST_SCORE, MIN_TRUST_SCORE } from "@/constants/app.constants";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireSessionUid } from "@/lib/auth/session";
import type { TrustEventType } from "@/types/trust.types";
import { clampTrustScore } from "@/utils/trust.utils";

export async function logTrustEvent(input: {
  userId: string;
  type: TrustEventType;
  delta: number;
  reason: string;
  relatedSubscriptionId: string | null;
}): Promise<void> {
  const db = getAdminDb();
  const userRef = db.collection(COLLECTIONS.users).doc(input.userId);
  const snap = await userRef.get();
  const current = snap.exists ? Number((snap.data() as { trustScore?: number }).trustScore ?? 50) : 50;
  const next = clampTrustScore(current + input.delta);

  await db.collection(COLLECTIONS.trustEvents).add({
    userId: input.userId,
    type: input.type,
    delta: input.delta,
    reason: input.reason,
    relatedSubscriptionId: input.relatedSubscriptionId,
    createdAt: FieldValue.serverTimestamp(),
  });

  await userRef.set(
    {
      trustScore: Math.min(MAX_TRUST_SCORE, Math.max(MIN_TRUST_SCORE, next)),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getTrustEventsForCurrentUser() {
  const uid = await requireSessionUid();
  const db = getAdminDb();
  const q = await db.collection(COLLECTIONS.trustEvents).where("userId", "==", uid).get();
  const rows = q.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Record<string, unknown>),
  })) as Array<Record<string, unknown> & { id: string }>;
  return rows
    .sort((a, b) => {
      const ta = (a.createdAt as { toMillis?: () => number })?.toMillis?.() ?? 0;
      const tb = (b.createdAt as { toMillis?: () => number })?.toMillis?.() ?? 0;
      return tb - ta;
    })
    .slice(0, 50);
}
