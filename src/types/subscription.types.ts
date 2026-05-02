import type {
  ParticipationStatus,
  SubscriptionShareStatus,
  SubscriptionVisibility,
  VerificationStatus,
} from "./common.types";
import type { Timestamp } from "firebase/firestore";

export type SubscriptionShare = {
  id: string;
  ownerId: string;
  title: string;
  serviceName: string;
  category: string;
  description: string | null;
  planLabel: string | null;
  pricePerSlotXof: number;
  totalSlots: number;
  filledSlots: number;
  visibility: SubscriptionVisibility;
  status: SubscriptionShareStatus;
  renewalDate: Timestamp | null;
  invoiceVerificationStatus: VerificationStatus | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

/** Données d’affichage pour les cartes (landing / listes). */
export type SubscriptionCardData = {
  id: string;
  title: string;
  serviceName: string;
  totalSlots: number;
  filledSlots: number;
  pricePerSlot: number;
  trustScore: number;
  isVerified: boolean;
};

export type Participation = {
  id: string;
  subscriptionId: string;
  userId: string;
  status: ParticipationStatus;
  message: string | null;
  requestedAt: Timestamp;
  updatedAt: Timestamp;
  lastPricePaidXof: number | null;
};
