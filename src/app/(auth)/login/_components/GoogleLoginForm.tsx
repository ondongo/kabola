"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { Alert } from "@/components/molecules/Alert";
import { Icons } from "@/constants/icons.constants";
import { useAuth } from "@/hooks/useAuth";

export default function GoogleLoginForm({
  variant = "page",
}: {
  variant?: "page" | "modal";
}) {
  const { signInWithGoogle, loading, configError } = useAuth();
  const [pending, setPending] = useState(false);

  const inner = (
    <div className="space-y-4 text-center">
        {configError ? (
          <Alert variant="danger" title="Configuration Firebase">
            {configError}
          </Alert>
        ) : null}
        {variant === "page" ? (
          <p className="text-sm text-text-secondary">
            Connexion sécurisée avec ton compte Google — aucun mot de passe à gérer.
          </p>
        ) : null}
        <Button
          type="button"
          className="w-full"
          size="lg"
          variant="outline"
          isLoading={pending || loading}
          disabled={Boolean(configError)}
          icon={<Icons.google size={22} />}
          onClick={() => {
            setPending(true);
            void (async () => {
              try {
                await signInWithGoogle();
              } finally {
                setPending(false);
              }
            })();
          }}
        >
          Continuer avec Google
        </Button>
        {variant === "modal" ? (
          <p className="text-xs text-text-muted">
            Promis, c’est rapide — comme choisir ta série du soir.
          </p>
        ) : null}
      </div>
  );

  if (variant === "modal") {
    return <div className="py-1">{inner}</div>;
  }

  return <Card padding="lg">{inner}</Card>;
}
