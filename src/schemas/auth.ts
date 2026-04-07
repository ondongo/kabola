"use server";

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Email invalide" }),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
      .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" }),
    email: z
      .string()
      .min(1, { message: "L'email est requis" })
      .email({ message: "Email invalide" }),
    phone: z
      .string()
      .regex(/^\+?[0-9]{9,15}$/, {
        message: "Numéro de téléphone invalide",
      })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, { message: "Au moins 8 caractères" })
      .regex(/[a-zA-Z]/, { message: "Doit contenir au moins une lettre" })
      .regex(/[0-9]/, { message: "Doit contenir au moins un chiffre" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
