import type { PaymentStatus } from "./common.types";
import type { Timestamp } from "firebase/firestore";

export type PaymentRecord = {
  id: string;
  userId: string;
  subscriptionId: string;
  participationId: string | null;
  amountXof: number;
  platformFeeXof: number;
  ownerPayoutXof: number;
  status: PaymentStatus;
  paydunyaInvoiceToken: string | null;
  paydunyaTransactionId: string | null;
  paydunyaResponse: Record<string, unknown> | null;
  escrowReleased: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
