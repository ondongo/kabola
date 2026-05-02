import type { Timestamp } from "firebase/firestore";

export type TrustEventType =
  | "payment_ok"
  | "payment_failed"
  | "invoice_verified"
  | "dispute_opened"
  | "participation_completed";

export type TrustEvent = {
  id: string;
  userId: string;
  type: TrustEventType;
  delta: number;
  reason: string;
  relatedSubscriptionId: string | null;
  createdAt: Timestamp;
};
