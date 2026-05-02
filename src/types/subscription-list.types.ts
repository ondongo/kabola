import type { VerificationStatus } from "./common.types";
import type { SubscriptionShareStatus, SubscriptionVisibility } from "./common.types";

/** Données sérialisables pour les listes (client). */
export type SubscriptionListItem = {
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
  invoiceVerificationStatus: VerificationStatus | null;
};
