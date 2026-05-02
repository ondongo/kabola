export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string | Record<string, string[]> };

export type UserRole = "admin" | "member" | "viewer";

export type VerificationStatus =
  | "pending_review"
  | "auto_verified"
  | "flagged"
  | "manually_verified"
  | "rejected";

export type ParticipationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "refunded"
  | "released";

export type SubscriptionVisibility = "public" | "private";

export type SubscriptionShareStatus = "active" | "paused" | "closed";

export type NotificationKind =
  | "payment"
  | "participation"
  | "message"
  | "system"
  | "verification"
  | "trust";
