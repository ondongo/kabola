import { z } from "zod";

export const createSubscriptionSchema = z.object({
  serviceId: z.string().min(1, { message: "Le service est requis" }),
  title: z
    .string()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères" })
    .max(100),
  description: z.string().max(500).optional(),
  plan: z.string().optional(),
  pricePerSlot: z
    .number()
    .min(100, { message: "Le prix minimum est de 100 FCFA" }),
  totalSlots: z
    .number()
    .min(2, { message: "Au moins 2 places" })
    .max(20, { message: "Maximum 20 places" }),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  renewalDate: z.string().optional(),
});

export const joinSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1),
  message: z.string().max(500).optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type JoinSubscriptionInput = z.infer<typeof joinSubscriptionSchema>;
