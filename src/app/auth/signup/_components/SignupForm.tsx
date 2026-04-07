"use client";

import { useActionState } from "react";
import { FiUser, FiMail, FiLock, FiPhone } from "react-icons/fi";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { signupAction } from "@/services/auth";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, undefined);

  return (
    <Card padding="lg">
      <form action={formAction} className="space-y-4">
        <Input
          name="name"
          label="Nom complet"
          placeholder="Moussa Diallo"
          icon={<FiUser size={18} />}
          error={state?.errors?.name?.[0]}
          required
        />

        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="votre@email.com"
          icon={<FiMail size={18} />}
          error={state?.errors?.email?.[0]}
          required
        />

        <Input
          name="phone"
          type="tel"
          label="Téléphone (optionnel)"
          placeholder="+221 77 123 45 67"
          icon={<FiPhone size={18} />}
          error={state?.errors?.phone?.[0]}
        />

        <Input
          name="password"
          type="password"
          label="Mot de passe"
          placeholder="••••••••"
          icon={<FiLock size={18} />}
          error={state?.errors?.password?.[0]}
          required
        />

        <Input
          name="confirmPassword"
          type="password"
          label="Confirmer le mot de passe"
          placeholder="••••••••"
          icon={<FiLock size={18} />}
          error={state?.errors?.confirmPassword?.[0]}
          required
        />

        {state?.message && (
          <p className="text-sm text-danger">{state.message}</p>
        )}

        <div className="text-xs text-text-muted">
          En créant un compte, vous acceptez nos{" "}
          <a href="#" className="text-primary hover:underline">
            Conditions d&apos;utilisation
          </a>{" "}
          et notre{" "}
          <a href="#" className="text-primary hover:underline">
            Politique de confidentialité
          </a>
          .
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={pending}
        >
          Créer mon compte
        </Button>
      </form>
    </Card>
  );
}
