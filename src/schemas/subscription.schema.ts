import { z } from "zod";

export const createSubscriptionSchema = z.object({
  title: z.string().min(3).max(120),
  serviceName: z.string().min(2).max(80),
  category: z.string().min(1).max(32),
  description: z.string().max(2000).optional().or(z.literal("")),
  planLabel: z.string().max(80).optional().or(z.literal("")),
  pricePerSlotXof: z.coerce.number().int().min(500).max(500_000),
  totalSlots: z.coerce.number().int().min(2).max(20),
  visibility: z.enum(["public", "private"]),
  renewalDateIso: z.string().optional().or(z.literal("")),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

export const participationRequestSchema = z.object({
  subscriptionId: z.string().min(8),
  message: z.string().max(500).optional().or(z.literal("")),
});

export type ParticipationRequestInput = z.infer<typeof participationRequestSchema>;
