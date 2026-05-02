"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import {
  APP_NAME,
  COLLECTIONS,
  PLATFORM_FEE_PERCENT,
  PLATFORM_FIXED_FEE_XOF,
} from "@/constants/app.constants";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireSessionUid } from "@/lib/auth/session";
import { initiatePaymentSchema } from "@/schemas/payment.schema";
import type { ActionResult } from "@/types/common.types";
import {
  checkoutUrlFromToken,
  createCheckoutInvoice,
} from "@/utils/paydunya.utils";
import { getUserProfileByUid } from "@/services/user.service";
import { ROUTES } from "@/constants/routes.constants";

function computeFees(amountXof: number): { platformFeeXof: number; ownerPayoutXof: number } {
  const platformFeeXof =
    Math.round((amountXof * PLATFORM_FEE_PERCENT) / 100) + PLATFORM_FIXED_FEE_XOF;
  const ownerPayoutXof = Math.max(0, amountXof - platformFeeXof);
  return { platformFeeXof, ownerPayoutXof };
}

export async function initiateSubscriptionPayment(
  input: unknown,
): Promise<ActionResult<{ redirectUrl: string }>> {
  const userId = await requireSessionUid();
  const parsed = initiatePaymentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const { subscriptionId, participationId, amountXof } = parsed.data;
  const db = getAdminDb();
  const subSnap = await db.collection(COLLECTIONS.subscriptions).doc(subscriptionId).get();
  if (!subSnap.exists) {
    return { success: false, error: "Abonnement introuvable." };
  }
  const sub = subSnap.data() as {
    ownerId: string;
    pricePerSlotXof: number;
    title: string;
  };
  if (amountXof !== sub.pricePerSlotXof) {
    return { success: false, error: "Montant incohérent avec l’offre." };
  }

  const profile = await getUserProfileByUid(userId);
  const { platformFeeXof, ownerPayoutXof } = computeFees(amountXof);

  const now = FieldValue.serverTimestamp();
  const paymentRef = await db.collection(COLLECTIONS.payments).add({
    userId,
    subscriptionId,
    participationId: participationId ?? null,
    amountXof,
    platformFeeXof,
    ownerPayoutXof,
    status: "pending",
    paydunyaInvoiceToken: null,
    paydunyaTransactionId: null,
    paydunyaResponse: null,
    escrowReleased: false,
    createdAt: now,
    updatedAt: now,
  });

  const returnUrl =
    process.env.PAYDUNYA_RETURN_URL?.trim() ||
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}${ROUTES.PAYMENTS}?token=`;
  const cancelUrl =
    process.env.PAYDUNYA_CANCEL_URL?.trim() ||
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}${ROUTES.SUBSCRIPTION_DETAIL(subscriptionId)}`;
  const callbackUrl =
    process.env.PAYDUNYA_CALLBACK_URL?.trim() ||
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/webhooks/paydunya`;

  const payRes = await createCheckoutInvoice({
    invoice: {
      total_amount: amountXof,
      description: `Kabola — ${sub.title}`,
      customer: {
        name: profile?.displayName ?? "Client Kabola",
        email: profile?.email ?? "client@kabola.sn",
        phone: profile?.phone?.replace("+221", "") ?? "770000000",
      },
    },
    store: {
      name: APP_NAME,
      tagline: "Partage d’abonnements",
    },
    custom_data: {
      paymentId: paymentRef.id,
      subscriptionId,
    },
    actions: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
      callback_url: callbackUrl,
    },
  });

  if (payRes.response_code !== "00" || !payRes.token) {
    await paymentRef.update({
      status: "failed",
      paydunyaResponse: payRes as unknown as Record<string, unknown>,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return {
      success: false,
      error: payRes.response_text ?? "Échec création facture PayDunya.",
    };
  }

  await paymentRef.update({
    paydunyaInvoiceToken: payRes.token,
    status: "processing",
    updatedAt: FieldValue.serverTimestamp(),
  });

  const redirectUrl = checkoutUrlFromToken(payRes.token);
  revalidatePath(ROUTES.PAYMENTS);
  return { success: true, data: { redirectUrl } };
}

export async function listPaymentsForUser(userId: string) {
  const db = getAdminDb();
  const q = await db.collection(COLLECTIONS.payments).where("userId", "==", userId).get();
  const rows = q.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Record<string, unknown>),
  })) as Array<Record<string, unknown> & { id: string }>;
  return rows.sort((a, b) => {
    const ta = (a.createdAt as { toMillis?: () => number })?.toMillis?.() ?? 0;
    const tb = (b.createdAt as { toMillis?: () => number })?.toMillis?.() ?? 0;
    return tb - ta;
  }).slice(0, 50);
}
