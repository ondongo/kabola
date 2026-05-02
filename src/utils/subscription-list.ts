import type { SubscriptionShare } from "@/types/subscription.types";
import type { SubscriptionListItem } from "@/types/subscription-list.types";

export function toSubscriptionListItem(s: SubscriptionShare): SubscriptionListItem {
  return {
    id: s.id,
    ownerId: s.ownerId,
    title: s.title,
    serviceName: s.serviceName,
    category: s.category,
    description: s.description,
    planLabel: s.planLabel,
    pricePerSlotXof: s.pricePerSlotXof,
    totalSlots: s.totalSlots,
    filledSlots: s.filledSlots,
    visibility: s.visibility,
    status: s.status,
    invoiceVerificationStatus: s.invoiceVerificationStatus,
  };
}
