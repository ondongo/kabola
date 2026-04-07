"use client";

import { useActionState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { loginAction } from "@/services/auth";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <Card padding="lg">
      <form action={formAction} className="space-y-4">
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="votre@email.com"
          icon={<FiMail size={18} />}
          required
        />

        <Input
          name="password"
          type="password"
          label="Mot de passe"
          placeholder="••••••••"
          icon={<FiLock size={18} />}
          required
        />

        {state?.message && (
          <p className="text-sm text-danger">{state.message}</p>
        )}

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-border" />
            <span className="text-text-secondary">Se souvenir de moi</span>
          </label>
          <a href="#" className="font-medium text-primary hover:underline">
            Mot de passe oublié ?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={pending}
        >
          Se connecter
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-text-muted">
              Ou continuer avec
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="outline" size="md">
            Wave
          </Button>
          <Button variant="outline" size="md">
            Google
          </Button>
        </div>
      </div>
    </Card>
  );
}
