import { z } from "zod";

const phoneSn = z.union([
  z.literal(""),
  z.string().regex(/^(\+221)?[0-9]{9}$/, "Numéro sénégalais attendu (9 chiffres, +221 optionnel)"),
]);

export const profileUpdateSchema = z.object({
  displayName: z.string().min(2, "Au moins 2 caractères").max(80),
  bio: z.union([z.string().max(500), z.literal("")]).optional(),
  phone: phoneSn.optional(),
  country: z.string().length(2).default("SN"),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
