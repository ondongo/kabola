"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { COLLECTIONS } from "@/constants/app.constants";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireSessionUid } from "@/lib/auth/session";
import { participationRequestSchema } from "@/schemas/subscription.schema";
import type { ActionResult } from "@/types/common.types";
import type { Participation } from "@/types/subscription.types";
import { ROUTES } from "@/constants/routes.constants";

function toParticipation(
  id: string,
  data: Record<string, unknown>,
): Participation {
  return {
    id,
    subscriptionId: String(data.subscriptionId ?? ""),
    userId: String(data.userId ?? ""),
    status: data.status as Participation["status"],
    message: data.message != null ? String(data.message) : null,
    requestedAt: data.requestedAt as Participation["requestedAt"],
    updatedAt: data.updatedAt as Participation["updatedAt"],
    lastPricePaidXof:
      data.lastPricePaidXof === null || data.lastPricePaidXof === undefined
        ? null
        : Number(data.lastPricePaidXof),
  };
}

export async function requestParticipation(input: {
  subscriptionId: string;
  message?: string;
}): Promise<ActionResult<{ id: string }>> {
  const userId = await requireSessionUid();
  const parsed = participationRequestSchema.safeParse(input);
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
  const sub = subSnap.data() as { ownerId: string; filledSlots: number; totalSlots: number; visibility: string };
  if (sub.ownerId === userId) {
    return { success: false, error: "Vous êtes déjà l’hôte de ce groupe." };
  }
  if (sub.filledSlots >= sub.totalSlots) {
    return { success: false, error: "Plus de place disponible." };
  }

  const existing = await db
    .collection(COLLECTIONS.participations)
    .where("subscriptionId", "==", parsed.data.subscriptionId)
    .where("userId", "==", userId)
    .limit(1)
    .get();
  if (!existing.empty) {
    return { success: false, error: "Demande déjà en cours ou existante." };
  }

  const now = FieldValue.serverTimestamp();
  const status = sub.visibility === "private" ? "pending" : "accepted";
  const docRef = await db.collection(COLLECTIONS.participations).add({
    subscriptionId: parsed.data.subscriptionId,
    userId,
    status,
    message: parsed.data.message || null,
    requestedAt: now,
    updatedAt: now,
    lastPricePaidXof: null,
  });

  if (status === "accepted") {
    await db
      .collection(COLLECTIONS.subscriptions)
      .doc(parsed.data.subscriptionId)
      .update({
        filledSlots: FieldValue.increment(1),
        updatedAt: now,
      });
  }

  revalidatePath(ROUTES.SUBSCRIPTION_DETAIL(parsed.data.subscriptionId));
  return { success: true, data: { id: docRef.id } };
}

export async function respondParticipation(input: {
  participationId: string;
  accept: boolean;
}): Promise<ActionResult> {
  const ownerId = await requireSessionUid();
  const db = getAdminDb();
  const partRef = db.collection(COLLECTIONS.participations).doc(input.participationId);
  const partSnap = await partRef.get();
  if (!partSnap.exists) {
    return { success: false, error: "Demande introuvable." };
  }
  const part = partSnap.data() as { subscriptionId: string; status: string };
  if (part.status !== "pending") {
    return { success: false, error: "Cette demande n’est plus modifiable." };
  }
  const subSnap = await db
    .collection(COLLECTIONS.subscriptions)
    .doc(part.subscriptionId)
    .get();
  if (!subSnap.exists) {
    return { success: false, error: "Abonnement introuvable." };
  }
  const sub = subSnap.data() as { ownerId: string; filledSlots: number; totalSlots: number };
  if (sub.ownerId !== ownerId) {
    return { success: false, error: "Action non autorisée." };
  }

  const now = FieldValue.serverTimestamp();
  if (input.accept) {
    if (sub.filledSlots >= sub.totalSlots) {
      return { success: false, error: "Plus de place disponible." };
    }
    await partRef.update({ status: "accepted", updatedAt: now });
    await db
      .collection(COLLECTIONS.subscriptions)
      .doc(part.subscriptionId)
      .update({
        filledSlots: FieldValue.increment(1),
        updatedAt: now,
      });
  } else {
    await partRef.update({ status: "rejected", updatedAt: now });
  }

  revalidatePath(ROUTES.SUBSCRIPTION_DETAIL(part.subscriptionId));
  return { success: true, data: undefined };
}

export async function listParticipationsForUser(
  userId: string,
): Promise<Participation[]> {
  const db = getAdminDb();
  const q = await db
    .collection(COLLECTIONS.participations)
    .where("userId", "==", userId)
    .get();
  const rows = q.docs.map((d) => toParticipation(d.id, d.data() as Record<string, unknown>));
  return rows.sort((a, b) => {
    const ta = a.requestedAt?.toMillis?.() ?? 0;
    const tb = b.requestedAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
}
