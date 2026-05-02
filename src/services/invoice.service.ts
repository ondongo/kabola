"use server";

import { FieldValue } from "firebase-admin/firestore";
import pdfParse from "pdf-parse";
import { revalidatePath } from "next/cache";
import { COLLECTIONS } from "@/constants/app.constants";
import { getAdminDb, getAdminStorage } from "@/lib/firebase/admin";
import { requireSessionUid } from "@/lib/auth/session";
import { invoiceUploadMetadataSchema } from "@/schemas/invoice.schema";
import type { ActionResult, VerificationStatus } from "@/types/common.types";
import { ROUTES } from "@/constants/routes.constants";

function scoreFromTextAndRules(params: {
  text: string;
  declaredAmountXof?: number;
  expectedPriceXof: number;
}): { status: VerificationStatus; confidence: number; flags: string[] } {
  const flags: string[] = [];
  const amountMatches = [...params.text.matchAll(/(\d[\d\s]*)\s*(fcfa|xof|f\s*cfa)/gi)];
  const numbers = amountMatches
    .map((m) => Number(String(m[1]).replace(/\s/g, "")))
    .filter((n) => !Number.isNaN(n));

  if (numbers.length === 0) {
    flags.push("montant_non_detecte");
  } else {
    const close = numbers.some(
      (n) => Math.abs(n - params.expectedPriceXof) <= Math.max(50, params.expectedPriceXof * 0.05),
    );
    if (!close) flags.push("ecart_montant");
  }

  if (params.declaredAmountXof != null) {
    if (Math.abs(params.declaredAmountXof - params.expectedPriceXof) > Math.max(100, params.expectedPriceXof * 0.08)) {
      flags.push("ecart_declare_abonnement");
    }
  }

  const lower = params.text.toLowerCase();
  const hasKeyword =
    lower.includes("netflix") ||
    lower.includes("spotify") ||
    lower.includes("facture") ||
    lower.includes("invoice") ||
    lower.includes("reçu");

  if (!hasKeyword && params.text.length > 20) flags.push("libelle_peu_concluant");

  let confidence = 0.55;
  if (flags.length === 0) confidence = 0.88;
  else if (flags.length === 1) confidence = 0.62;
  else confidence = 0.45;

  let status: VerificationStatus = "pending_review";
  if (flags.length === 0 && confidence >= 0.85) status = "auto_verified";
  else if (flags.length >= 2) status = "flagged";

  return { status, confidence, flags };
}

export async function finalizeInvoiceAfterUpload(input: unknown): Promise<ActionResult<{ id: string }>> {
  const uid = await requireSessionUid();
  const parsed = invoiceUploadMetadataSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const {
    subscriptionId,
    storagePath,
    fileName,
    mimeType,
    fileSize,
    declaredAmountXof,
    declaredMerchant,
  } = parsed.data;

  if (!storagePath.startsWith(`invoices/${uid}/`)) {
    return { success: false, error: "Chemin de stockage invalide." };
  }

  const db = getAdminDb();
  const subSnap = await db.collection(COLLECTIONS.subscriptions).doc(subscriptionId).get();
  if (!subSnap.exists) {
    return { success: false, error: "Abonnement introuvable." };
  }
  const sub = subSnap.data() as {
    ownerId: string;
    pricePerSlotXof: number;
    totalSlots: number;
  };
  if (sub.ownerId !== uid) {
    return { success: false, error: "Seul l’hôte peut soumettre une facture." };
  }

  const bucket = getAdminStorage().bucket();
  const [buffer] = await bucket.file(storagePath).download();

  let rawText = "";
  if (mimeType === "application/pdf") {
    const parsedPdf = await pdfParse(buffer);
    rawText = parsedPdf.text ?? "";
  }

  const expectedMonthly = sub.pricePerSlotXof * sub.totalSlots;
  const textForRules = rawText || (declaredMerchant ?? "");

  const refined = scoreFromTextAndRules({
    text: textForRules,
    declaredAmountXof,
    expectedPriceXof: expectedMonthly,
  });

  const now = FieldValue.serverTimestamp();
  const docRef = await db.collection(COLLECTIONS.invoices).add({
    userId: uid,
    subscriptionId,
    storagePath,
    fileName,
    mimeType,
    fileSize,
    status: refined.status,
    confidenceScore: refined.confidence,
    ocrHints: {
      rawTextSample: rawText.slice(0, 1200),
      detectedAmountXof: declaredAmountXof ?? null,
      detectedPeriod: null,
      detectedMerchant: declaredMerchant || null,
    },
    anomalyFlags: refined.flags,
    reviewNotes: null,
    reviewedByUid: null,
    reviewedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  await db
    .collection(COLLECTIONS.subscriptions)
    .doc(subscriptionId)
    .set(
      {
        invoiceVerificationStatus: refined.status,
        updatedAt: now,
      },
      { merge: true },
    );

  revalidatePath(ROUTES.SUBSCRIPTION_DETAIL(subscriptionId));
  return { success: true, data: { id: docRef.id } };
}
