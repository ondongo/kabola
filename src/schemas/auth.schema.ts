import { z } from "zod";

/** Réservé aux flux internes (ex. validation de jeton côté serveur). */
export const firebaseIdTokenSchema = z.object({
  idToken: z.string().min(100),
});

export type FirebaseIdTokenInput = z.infer<typeof firebaseIdTokenSchema>;
