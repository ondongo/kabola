export type UserRole = "USER" | "ADMIN" | "MODERATOR";

export type ServiceCategory =
  | "VIDEO"
  | "MUSIC"
  | "VPN"
  | "PRODUCTIVITY"
  | "GAMING"
  | "DESIGN"
  | "CLOUD"
  | "EDUCATION"
  | "OTHER";

export type SubscriptionStatus =
  | "ACTIVE"
  | "PAUSED"
  | "EXPIRING"
  | "EXPIRED"
  | "CANCELLED";

export type MembershipStatus =
  | "PENDING"
  | "ACTIVE"
  | "REJECTED"
  | "LEFT"
  | "REMOVED";

export type TransactionStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "DISPUTED";

export type PaymentMethod =
  | "WAVE"
  | "ORANGE_MONEY"
  | "FREE_MONEY"
  | "CARD"
  | "BANK_TRANSFER";

export type InvoiceStatus =
  | "NONE"
  | "PENDING_REVIEW"
  | "AUTO_VERIFIED"
  | "FLAGGED"
  | "MANUALLY_VERIFIED"
  | "REJECTED";

export type NotificationType =
  | "PAYMENT"
  | "MEMBERSHIP"
  | "MESSAGE"
  | "SYSTEM"
  | "VERIFICATION"
  | "TRUST";

export type Visibility = "PUBLIC" | "PRIVATE";

export type EscrowStatus = "NONE" | "HELD" | "RELEASED" | "REFUNDED";

export interface ServiceActionResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface TrustInfo {
  score: number;
  level: string;
  color: string;
  groups: number;
  rating: number;
  saved: number;
}

export interface SubscriptionCardData {
  id: string;
  title: string;
  serviceName: string;
  serviceIcon?: string;
  pricePerSlot: number;
  currency: string;
  totalSlots: number;
  filledSlots: number;
  trustScore: number;
  category: ServiceCategory;
  isVerified: boolean;
  ownerName?: string;
}

export interface DashboardStats {
  totalSaved: number;
  activeShares: number;
  trustScore: number;
  monthlySpending: number;
}
