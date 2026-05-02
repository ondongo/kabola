import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { COLLECTIONS } from "@/constants/app.constants";
import { getAdminDb } from "@/lib/firebase/admin";
import { confirmCheckoutInvoice } from "@/utils/paydunya.utils";
import { createNotification } from "@/services/notification.service";
import { logTrustEvent } from "@/services/trust.service";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let token: string | null = null;
    let paymentId: string | null = null;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const body = await request.text();
      const params = new URLSearchParams(body);
      const dataRaw = params.get("data");
      if (dataRaw) {
        const parsed = JSON.parse(dataRaw) as {
          invoice?: { token?: string };
          status?: string;
          custom_data?: { paymentId?: string; subscriptionId?: string };
        };
        token = parsed.invoice?.token ?? null;
        paymentId = parsed.custom_data?.paymentId ?? null;
      }
    } else {
      const json = (await request.json()) as {
        token?: string;
        paymentId?: string;
      };
      token = json.token ?? null;
      paymentId = json.paymentId ?? null;
    }

    if (!token) {
      return NextResponse.json({ ok: false, error: "token manquant" }, { status: 400 });
    }

    const confirmed = await confirmCheckoutInvoice(token);
    if (confirmed.response_code !== "00") {
      return NextResponse.json({ ok: false, error: confirmed.response_text }, { status: 400 });
    }

    const status = (confirmed.status ?? "").toLowerCase();
    const db = getAdminDb();

    if (!paymentId) {
      const byToken = await db
        .collection(COLLECTIONS.payments)
        .where("paydunyaInvoiceToken", "==", token)
        .limit(1)
        .get();
      if (!byToken.empty) {
        paymentId = byToken.docs[0].id;
      }
    }

    if (paymentId) {
      const payRef = db.collection(COLLECTIONS.payments).doc(paymentId);
      const paySnap = await payRef.get();
      if (paySnap.exists) {
        const pay = paySnap.data() as { userId: string; subscriptionId: string; amountXof: number };
        const nextStatus =
          status === "completed" ? "paid" : status === "failed" ? "failed" : "processing";
        await payRef.update({
          status: nextStatus,
          paydunyaTransactionId: token,
          paydunyaResponse: confirmed as unknown as Record<string, unknown>,
          updatedAt: FieldValue.serverTimestamp(),
          escrowReleased: status === "completed",
        });

        if (status === "completed") {
          await createNotification({
            userId: pay.userId,
            kind: "payment",
            title: "Paiement confirmé",
            body: `Votre paiement de ${pay.amountXof} FCFA a été reçu. L’accès sera validé par l’hôte.`,
            data: { subscriptionId: pay.subscriptionId },
          });
          await logTrustEvent({
            userId: pay.userId,
            type: "payment_ok",
            delta: 2,
            reason: "Paiement PayDunya confirmé",
            relatedSubscriptionId: pay.subscriptionId,
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur IPN";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
