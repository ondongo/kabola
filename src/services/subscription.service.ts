"use server";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { DocumentData } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { COLLECTIONS } from "@/constants/app.constants";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireSessionUid } from "@/lib/auth/session";
import { createSubscriptionSchema } from "@/schemas/subscription.schema";
import { z } from "zod";
import type { ActionResult } from "@/types/common.types";
import type { SubscriptionShare } from "@/types/subscription.types";
import type { SubscriptionListItem } from "@/types/subscription-list.types";
import { ROUTES } from "@/constants/routes.constants";
import { getUserProfileByUid } from "@/services/user.service";
import { toSubscriptionListItem } from "@/utils/subscription-list";

function toShare(id: string, data: DocumentData): SubscriptionShare {
  return { id, ...(data as Omit<SubscriptionShare, "id">) };
}

export async function createSubscriptionAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const ownerId = await requireSessionUid();
  const raw = {
    title: formData.get("title"),
    serviceName: formData.get("serviceName"),
    category: formData.get("category"),
    description: formData.get("description"),
    planLabel: formData.get("planLabel"),
    pricePerSlotXof: formData.get("pricePerSlotXof"),
    totalSlots: formData.get("totalSlots"),
    visibility: formData.get("visibility"),
    renewalDateIso: formData.get("renewalDateIso") || undefined,
  };
  const parsed = createSubscriptionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const profile = await getUserProfileByUid(ownerId);
  /** Téléphone obligatoire pour le 1er partage public (exploration). Le privé (lien seul) peut être créé sans SMS. */
  if (!profile?.phoneVerified) {
    const existing = await listSubscriptionsForOwner(ownerId);
    if (
      existing.length === 0 &&
      parsed.data.visibility === "public"
    ) {
      return {
        success: false,
        error:
          "Pour un partage visible dans l’exploration, confirmez votre numéro par SMS. Sinon publiez en mode privé (invitation par lien).",
      };
    }
  }

  const db = getAdminDb();
  const now = FieldValue.serverTimestamp();
  const rawRenewal = parsed.data.renewalDateIso?.trim();
  const renewalDate =
    rawRenewal && !Number.isNaN(Date.parse(rawRenewal))
      ? Timestamp.fromDate(new Date(rawRenewal))
      : null;
  const docRef = await db.collection(COLLECTIONS.subscriptions).add({
    ownerId,
    title: parsed.data.title,
    serviceName: parsed.data.serviceName,
    category: parsed.data.category,
    description: parsed.data.description || null,
    planLabel: parsed.data.planLabel || null,
    pricePerSlotXof: parsed.data.pricePerSlotXof,
    totalSlots: parsed.data.totalSlots,
    filledSlots: 0,
    visibility: parsed.data.visibility,
    status: "active",
    renewalDate,
    invoiceVerificationStatus: null,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath(ROUTES.SUBSCRIPTIONS_BROWSE);
  revalidatePath(ROUTES.DASHBOARD);
  return { success: true, data: { id: docRef.id } };
}

const updateVisibilitySchema = z.object({
  subscriptionId: z.string().min(8),
  visibility: z.enum(["public", "private"]),
});

export async function updateSubscriptionVisibilityAction(
  input: unknown,
): Promise<ActionResult<void>> {
  const uid = await requireSessionUid();
  const parsed = updateVisibilitySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Données invalides." };
  }
  const db = getAdminDb();
  const ref = db.collection(COLLECTIONS.subscriptions).doc(parsed.data.subscriptionId);
  const snap = await ref.get();
  if (!snap.exists) {
    return { success: false, error: "Abonnement introuvable." };
  }
  const sub = snap.data() as { ownerId: string };
  if (sub.ownerId !== uid) {
    return { success: false, error: "Seul l’hôte peut modifier la visibilité." };
  }

  if (parsed.data.visibility === "public") {
    const profile = await getUserProfileByUid(uid);
    if (!profile?.phoneVerified) {
      return {
        success: false,
        error:
          "Pour un partage public, confirmez d’abord votre numéro par SMS (Profil → Vérifier mon téléphone).",
      };
    }
  }

  await ref.set(
    {
      visibility: parsed.data.visibility,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  revalidatePath(ROUTES.SUBSCRIPTION_DETAIL(parsed.data.subscriptionId));
  revalidatePath(ROUTES.SUBSCRIPTIONS_BROWSE);
  revalidatePath(ROUTES.MESSAGES);
  return { success: true, data: undefined };
}

export async function getSubscriptionById(
  id: string,
): Promise<SubscriptionShare | null> {
  const db = getAdminDb();
  const snap = await db.collection(COLLECTIONS.subscriptions).doc(id).get();
  if (!snap.exists) return null;
  return toShare(snap.id, snap.data() ?? {});
}

const PUBLIC_EXPLORE_PAGE_SIZE = 20;

/** Abonnements publics actifs, tri récents, avec curseur Firestore. */
export async function listPublicSubscriptionsPage(
  pageSize: number,
  cursorDocId: string | null,
): Promise<{ items: SubscriptionShare[]; nextCursor: string | null }> {
  const db = getAdminDb();
  const size = Math.min(Math.max(pageSize, 1), 50);
  const col = db.collection(COLLECTIONS.subscriptions);
  let q = col
    .where("visibility", "==", "public")
    .where("status", "==", "active")
    .orderBy("createdAt", "desc")
    .limit(size + 1);
  if (cursorDocId) {
    const cur = await col.doc(cursorDocId).get();
    if (cur.exists) {
      q = col
        .where("visibility", "==", "public")
        .where("status", "==", "active")
        .orderBy("createdAt", "desc")
        .startAfter(cur)
        .limit(size + 1);
    }
  }
  const snap = await q.get();
  const docs = snap.docs;
  const hasMore = docs.length > size;
  const slice = hasMore ? docs.slice(0, size) : docs;
  const items = slice.map((d) => toShare(d.id, d.data()));
  const nextCursor = hasMore && slice.length > 0 ? slice[slice.length - 1]!.id : null;
  return { items, nextCursor };
}

export async function loadMorePublicSubscriptionsAction(
  cursorDocId: string,
): Promise<
  ActionResult<{ items: SubscriptionListItem[]; nextCursor: string | null }>
> {
  const { items, nextCursor } = await listPublicSubscriptionsPage(
    PUBLIC_EXPLORE_PAGE_SIZE,
    cursorDocId,
  );
  return {
    success: true,
    data: { items: items.map(toSubscriptionListItem), nextCursor },
  };
}

/** Première page exploration (taille fixe). */
export async function listPublicSubscriptionsInitial(): Promise<{
  items: SubscriptionShare[];
  nextCursor: string | null;
}> {
  return listPublicSubscriptionsPage(PUBLIC_EXPLORE_PAGE_SIZE, null);
}

/** @deprecated Préférer listPublicSubscriptionsPage / listPublicSubscriptionsInitial */
export async function listPublicSubscriptions(limit = 24): Promise<SubscriptionShare[]> {
  const { items } = await listPublicSubscriptionsPage(limit, null);
  return items;
}

export async function listSubscriptionsForOwner(
  ownerId: string,
): Promise<SubscriptionShare[]> {
  const db = getAdminDb();
  const q = await db
    .collection(COLLECTIONS.subscriptions)
    .where("ownerId", "==", ownerId)
    .get();
  const rows = q.docs.map((d) => toShare(d.id, d.data()));
  return rows.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
}
