import { z } from "zod";

export const initiatePaymentSchema = z.object({
  subscriptionId: z.string().min(8),
  participationId: z.string().min(8).optional(),
  amountXof: z.coerce.number().int().min(100),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
